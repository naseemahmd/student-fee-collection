import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Tuition } from '../transaction/dto/tuition';
import { Transaction } from '../transaction/dto/transaction.entity';
import { Repository } from 'typeorm';
import { Purchase, ReceiptDTO, StudentDto } from './dto/receiptDto';
import { Receipt } from './dto/receipt.entity';
import { Student } from './dto/studentDto';
import { TransactionDto } from './dto/TransactionDto';
import { PinoLogger } from 'nestjs-pino';
@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt) private receiptRepository: Repository<Receipt>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly httpService: HttpService,
    private _logger: PinoLogger,
  ) {
    _logger.setContext(ReceiptService.name);
  }

  //Get all Receipts
  async getReceipts() {
    this._logger.info(`getReceipts is called`);
    try {
      const receipts = await this.receiptRepository.find({
        order: { created_at: 'ASC' },
      });
      this._logger.info(`Receipt Fetched Sucuss`);
      return receipts;
    } catch (error) {
      this._logger.info(`Receipt Fetched Error with ${error}`);
      return new BadGatewayException(
        'We Have Issue on Fetching! Please Try Again',
      );
    }
  }

  //Get one Receipt with Transaction ID
  async getReceipt(transactionID: string) {
    this._logger.info(`getReceipt is called with ${transactionID}`);

    try {
      const receipt = await this.receiptRepository.findOneBy({
        transactionID: transactionID,
      });
      const studentID = receipt.studentID;
      if (receipt) {
        let student = new Student();

        //Getting Data from Student Service
        const result = await firstValueFrom(
          this.httpService.get(
            `http://localhost:3000/getStudentWithStudentID/${studentID}`,
          ),
        );

        student = result.data;
        //Creating Receipt
        const finalReceipt = new ReceiptDTO();
        const studentRecpt = new StudentDto();
        const transactionDetail = new TransactionDto();
        const tutitionList: Purchase[] = [];

        studentRecpt.grade = student.grade;
        studentRecpt.schoolName = student.schoolName;
        studentRecpt.studentName = student.studentName;

        student.tuitions.forEach((tuition: Tuition) => {
          const tuitionDetails = new Purchase();

          tuitionDetails.tuitionName = tuition.tuitionName;
          tuitionDetails.tuitionFee = tuition.tuitionFee;
          tuitionDetails.grade = tuition.grade;

          tutitionList.push({ ...tuitionDetails });
        });
        const transaction = await this.transactionRepository.findOne({
          where: {
            transactionID: transactionID,
          },
        });

        transactionDetail.card = transaction.cardNumber;
        transactionDetail.cardType = transaction.cardType;
        transactionDetail.dateTime = transaction.transactionDate;
        transactionDetail.refferance = transaction.transactionID;
        transactionDetail.studentID = student.studentID;
        transactionDetail.studentName = student.studentName;

        finalReceipt.purchase = tutitionList;
        finalReceipt.student = { ...studentRecpt };
        finalReceipt.transaction = { ...transactionDetail };
        finalReceipt.emailNote =
          'This is an automated email, please do not reply. For any other query, please email us at contactus@skiply.ae';

        this._logger.info(`New Receipt is created`);
        return { ...finalReceipt };
      } else {
        this._logger.info(`Receipt is not found`);
        return new NotFoundException('Receipt is not found');
      }
    } catch (error) {
      this._logger.info(`Receipt Fetched Error with ${error}`);
      return new BadGatewayException(
        'We Have Issue on Fetching! Please Try Again',
      );
    }
  }
  async createReceipt(receipt: Receipt): Promise<Receipt | Error> {
    try {
      const createReceipt = await this.receiptRepository.save(receipt);
      return { ...createReceipt };
    } catch (error) {
      this._logger.info(`Receipt create Error with ${error}`);
      return new BadGatewayException('We Have Issue on create Receipts');
    }
  }
  async updateReceipt(id: string, receipt: Receipt): Promise<Receipt | Error> {
    this._logger.info(`updateReceipt is Called for  ${id}`);
    try {
      const editReceipt = await this.receiptRepository.findOneBy({
        id: id,
      });

      if (!editReceipt) {
        this._logger.info(`Recipt is not found for ${id}`);

        return new NotFoundException('Recipt is not found');
      }
      await this.receiptRepository.update(id, receipt);
      const updatedReceipt = this.receiptRepository.findOneBy({ id: id });
      this._logger.info(`Recipt update Sucuss`);
      return { ...updatedReceipt };
    } catch (error) {
      this._logger.info(`Receipt update Error with ${error}`);
      return new BadGatewayException('We Have Issue on update Receipts');
    }
  }
  async deleteReceipt(id: any) {
    this._logger.info(`delete Receipt is Called for ${id}`);
    try {
      const deleteReceipt = await this.receiptRepository.delete(id);
      this._logger.info(`delete Receipt is sucuss`);

      return { ...deleteReceipt };
    } catch (error) {
      this._logger.info(`Receipt delete Error with ${error}`);
      return new BadGatewayException('We Have Issue on delete Receipts');
    }
  }
  async findOneByTranID(transactionID: string) {
    this._logger.info(`findOneByTranID is called for ${transactionID}`);
    try {
      const receipt = await this.receiptRepository.findOneBy({
        transactionID: transactionID,
      });
      if (!receipt) {
        this._logger.info(`Receipt is not found for ${transactionID}`);

        return new NotFoundException('Receipt is not found');
      }
      this._logger.info(`findOneByTranID is feteched Sucuss`);
      return receipt;
    } catch (error) {
      this._logger.info(`Receipt Fetched Error with ${error}`);
      return new BadGatewayException('We Have Issue on finding transactions');
    }
  }
}
