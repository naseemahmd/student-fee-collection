import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Receipt } from '../receipt/dto/receipt.entity';
import { ReceiptService } from '../receipt/receipt.service';
import { Repository } from 'typeorm';
import { Transaction } from './dto/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpService: HttpService;

  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  };
  let receiptRepo: Repository<Receipt>;
  let transactionRepo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({}), HttpModule],
      providers: [
        TransactionService,
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
            logger.setContext('TransactionService');
            return logger;
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    receiptRepo = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all trasactions', () => {
    const findAllData = service.getTransactions();
    expect(findAllData).toBeTruthy();
  });

  it('findOne transaction function to be called', () => {
    const findOneData = service.findOne('');
    expect(findOneData).toBeTruthy();
  });

  it('Get Fee Details should return', () => {
    const findOneData = service.getFee('');
    expect(findOneData).toBeTruthy();
  });

  it('Should Get transaction Details by Id', () => {
    const findOneData = service.getTransactionById('');
    expect(findOneData).toBeTruthy();
  });

  it('create transaction should be called', () => {
    const event = new Transaction();

    const createData = service.collectFee(event);

    expect(createData).toBeTruthy();
  });

  it('remove function to should called', () => {
    const findRemoveData = service.deleteFee('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('update function should be called', () => {
    const event = new Transaction();

    jest.spyOn(transactionRepo, 'update').mockImplementation();

    const updateData = service.editFee('', event);

    expect(updateData).toBeTruthy();
  });
});
