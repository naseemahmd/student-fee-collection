import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { Receipt } from './dto/receipt.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Transaction } from 'src/transaction/dto/transaction.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Transaction]), HttpModule],
  providers: [ReceiptService],
  controllers: [ReceiptController],
})
export class ReceiptModule {}
