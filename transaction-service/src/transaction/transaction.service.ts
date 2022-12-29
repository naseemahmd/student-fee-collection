import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Student } from '../receipt/dto/studentDto';
import { Receipt } from '../receipt/dto/receipt.entity';
import { ReceiptService } from '../receipt/receipt.service';
import { Repository } from 'typeorm';
import { GetFee } from './dto/getFee';
import { Tuition } from './dto/tuition';
import { Transaction } from './dto/transaction.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly httpService: HttpService,
    private receiptService: ReceiptService,
    private _logger: PinoLogger,
  ) {
    _logger.setContext(TransactionService.name);
  }

  // Find All
  async getTransactions() {
    this._logger.info(`getTransactions is called`);
    try {
      const transactions = await this.transactionRepository.find();
      this._logger.info(`transaction fetched Sucussfully`);
      return transactions;
    } catch (error) {
      this._logger.info(`transaction fetched error with ${error}`);
      return new Error('We Have Issue on Fetching! Please Try Again');
    }
  }

  // Find one by TransactionID
  async getTransactionById(transactionID: string) {
    this._logger.info(`getTransactionById is called with ${transactionID}`);

    try {
      const transactions = await this.transactionRepository.findOne({
        where: {
          transactionID: transactionID,
        },
      });
      this._logger.info(`transactions is fetched for ${transactionID}`);

      return { ...transactions };
    } catch (error) {
      this._logger.info(`transaction fetched error with ${error}`);
      return new Error('Failed to Assign Tuiton');
    }
  }

  // Find one by id
  async findOne(id: any) {
    this._logger.info(`Transaction findOne is called`);
    try {
      const transaction = await this.transactionRepository.findOneBy(id);
      if (!transaction) {
        this._logger.info(`Transaction is not found for ${id}`);
        return new NotFoundException('Transaction is not found');
      }
      return { ...transaction };
    } catch (error) {
      this._logger.info(`transaction fetched error with ${error}`);
      return new Error('Failed to Assign Tuiton');
    }
  }

  // Get Fee Details for paticulr Student
  async getFee(studentID: string): Promise<GetFee | Error> {
    this._logger.info(`getFee is called for ${studentID}`);
    try {
      const result = await firstValueFrom(
        this.httpService.get(
          `http://localhost:3000/getStudentWithStudentID/${studentID}`,
        ),
      );
      const student: Student = result.data;
      const studetFee: GetFee = {
        studentName: '',
        studentID: '',
        tuitionList: [],
        totalFee: 0,
      };

      studetFee.studentID = student.studentID;
      studetFee.studentName = student.studentName;
      let totalFee = 0;
      const tuitionList = [];
      student.tuitions.forEach((tuition: Tuition) => {
        totalFee = totalFee + tuition.tuitionFee;
        tuitionList.push(tuition.tuitionName + ' Grade' + student.grade);
      });
      studetFee.totalFee = totalFee;
      studetFee.tuitionList = tuitionList;
      this._logger.info(`getFee is Sucusss for ${studentID}`);
      return { ...studetFee };
    } catch (error) {
      this._logger.info(`transaction fetched error with ${error}`);
      return new Error('We Have Issue on Fetching! Please Try Again');
    }
  }

  // Create Transcation with Create Receipt
  async collectFee(transaction: Transaction) {
    this._logger.info(
      `collectFee is called with ${JSON.stringify(transaction)}`,
    );

    try {
      let TransactionID = '';
      const lastTransaction = await this.transactionRepository.find();
      if (lastTransaction.length > 0) {
        const lastTransactionID =
          lastTransaction[lastTransaction.length - 1].transactionID;

        TransactionID = `${lastTransactionID.split(':')[0]}:${
          Number(lastTransactionID.split(':')[1]) + 1
        }`;
      } else {
        TransactionID = 'Trans:1001';
      }
      transaction.transactionID = TransactionID;
      transaction.transactionDate = new Date().toString();
      const createdTransaction = await this.transactionRepository.save(
        transaction,
      );
      this._logger.info(`New Transaction is Created ${TransactionID}`);
      try {
        let reciptID = '';
        const receipts: any = await this.receiptService.getReceipts();
        if (receipts.length > 0) {
          const lastReceiptID = receipts[receipts.length - 1].reciptID;

          reciptID = `${lastReceiptID.split(':')[0]}:${
            Number(lastReceiptID.split(':')[1]) + 1
          }`;
        } else {
          reciptID = 'Recp:1001';
        }
        const newReceipt = new Receipt();

        newReceipt.reciptID = reciptID;
        newReceipt.transactionID = TransactionID;
        newReceipt.studentID = transaction.studentID;

        await this.receiptService.createReceipt(newReceipt);
        this._logger.info(`New Receipt is Created ${reciptID}`);
      } catch (error) {
        this.transactionRepository.delete(createdTransaction.id);
        this._logger.info(
          `Create Transaction have issue with Create Receipt ${error} and ${TransactionID} is deleted`,
        );
        return new Error('We Have Issue on creating Transaction');
      }
      return { ...createdTransaction };
    } catch (error) {
      this._logger.info(`Create Transaction have issue ${error} `);
      return new Error('We Have Issue on creating Transaction');
    }
  }

  // Update Transaction
  async editFee(id: string, transaction: Transaction) {
    this._logger.info(
      `editisCalled is called with ${JSON.stringify(transaction)} for ${id}`,
    );
    try {
      const editTransaction = await this.transactionRepository.findOne({
        where: { id: id },
      });

      if (!editTransaction) {
        this._logger.info(`Transaction NotFound for ${id}`);
        return new NotFoundException('Transaction is not found');
      }
      await this.transactionRepository.update(id, transaction);

      const updatedTransaction = await this.transactionRepository.findOne({
        where: { id: id },
      });
      this._logger.info(`Transaction is Updated for ${id}`);
      return { ...updatedTransaction };
    } catch (error) {
      this._logger.info(`Transaction Updated issue with ${error} for ${id}`);
      return new Error('We Have Issue on updating Transaction');
    }
  }
  async deleteFee(id: string) {
    this._logger.info(`deleteFee for ${id}`);
    try {
      const editTransaction: any = await this.findOne(id);
      editTransaction.isActive = false;

      await this.transactionRepository.update(id, editTransaction);
      this._logger.info(
        `Delete Transaction is update as IsActive false for ${id}`,
      );
      const receipt: any = await this.receiptService.findOneByTranID(
        editTransaction.transactionID,
      );
      receipt.isActive = false;
      await this.receiptService.updateReceipt(receipt.id, receipt);
      this._logger.info(
        `Delete Transaction is Receipt update as IsActive false for ${id}`,
      );

      return 'Fee Returned Succuss';
    } catch (error) {
      return new Error('We Have Issue on Deleting Transaction');
    }
  }
}
