import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Transaction } from './dto/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Get All Transactions
  @MessagePattern('getTransactions')
  findAll() {
    return this.transactionService.getTransactions();
  }

  // Get One Transaction
  @MessagePattern('getOneTransaction')
  async findOne(@Body() id: string) {
    return await this.transactionService.findOne(id);
  }

  // Get Fee Details
  @MessagePattern('getFee')
  getFee(@Body() body: any) {
    return this.transactionService.getFee(body.studentID);
  }

  // Collect Fee / Create Transaction
  @MessagePattern('collectFee')
  create(@Body() transaction: Transaction) {
    return this.transactionService.collectFee(transaction);
  }

  // Update Fee / Update Transaction
  @MessagePattern('updateFee')
  async editFee(@Body() body: any) {
    return await this.transactionService.editFee(body.id, body.transaction);
  }
  // return Fee/ Delete Transaction
  @MessagePattern('returnFee')
  async remove(@Body() id: string) {
    return await this.transactionService.deleteFee(id);
  }
}
