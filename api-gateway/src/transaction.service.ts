import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { TransactionDto } from './dto/transactionDto.entity';

@Injectable()
export class TransactionService {
  // Trancation Service Client
  constructor(@Inject('TRANSACTION_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    const topis = [
      'getTransactions',
      'getOneTransaction',
      'collectFee',
      'updateFee',
      'returnFee',
      'getAllReceipts',
      'getReceipt',
      'getFee',
    ];
    topis.forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }

  getTransactions() {
    return this.client.send('getTransactions', {});
  }
  getOneTransaction(id: string) {
    return this.client.send('getOneTransaction', { id });
  }
  createTransaction(transaction: TransactionDto) {
    return this.client.send('collectFee', { ...transaction });
  }
  upadteTransaction(transaction: TransactionDto, id: string) {
    return this.client.send('updateFee', {
      transaction: transaction,
      id: id,
    });
  }
  deleteTransaction(id: string) {
    return this.client.send('returnFee', { id });
  }
  getFee(studentID: string) {
    return this.client.send('getFee', { studentID });
  }
  getOneReceipt(transactionID: string) {
    return this.client.send('getReceipt', { transactionID });
  }
}
