import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Transaction } from '../transaction/dto/transaction.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Receipt } from './dto/receipt.entity';
import { ReceiptService } from './receipt.service';
import { Purchase, ReceiptDTO, StudentDto } from './dto/receiptDto';
import { NotFoundException } from '@nestjs/common';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Student } from './dto/studentDto';
import { TransactionDto } from './dto/TransactionDto';
import { ReceiptController } from './receipt.controller';

describe('ReceiptController', () => {
  let service: ReceiptService;
  let controller: ReceiptController;
  let httpService: HttpService;
  const httpMock = { get: jest.fn(() => of(httpService)) };
  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
  };
  let receiptRepo: Repository<Receipt>;
  let transactionRepo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      imports: [LoggerModule.forRoot({}), HttpModule],
      providers: [
        ReceiptService,
        {
          provide: getRepositoryToken(Receipt),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: repositoryMock,
        },
        {
          provide: PinoLogger,
          useFactory: () => {
            const logger: PinoLogger = new PinoLogger({});
            logger.setContext('ReceiptService');
            return logger;
          },
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    httpService = module.get<HttpService>(HttpService);
    controller = module.get<ReceiptController>(ReceiptController);
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    receiptRepo = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all receipts', async () => {
    const result = new ReceiptDTO();
    jest.spyOn(service, 'getReceipt').mockImplementation(async () => result);

    const findAllData = await controller.findOne({ transactionID: '' });
    expect(findAllData).toEqual(result);
  });
});
