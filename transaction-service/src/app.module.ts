import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction/dto/transaction.entity';
import { Receipt } from './receipt/dto/receipt.entity';
import { ReceiptModule } from './receipt/receipt.module';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransactionModule,
    ReceiptModule,
    HttpModule,
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Nasm1900',
      database: 'student-fee-management',
      entities: [Receipt, Transaction],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
