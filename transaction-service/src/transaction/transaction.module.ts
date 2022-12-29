import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from 'src/receipt/dto/receipt.entity';
import { ReceiptService } from 'src/receipt/receipt.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './dto/transaction.entity';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Receipt]), HttpModule],
  controllers: [TransactionController],
  providers: [TransactionService, ReceiptService],
})
export class TransactionModule {}
