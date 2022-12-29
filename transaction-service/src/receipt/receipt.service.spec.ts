import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Transaction } from '../transaction/dto/transaction.entity';
import { Repository } from 'typeorm';
import { Receipt } from './dto/receipt.entity';
import { ReceiptService } from './receipt.service';

describe('ReceiptService', () => {
  let service: ReceiptService;
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
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    receiptRepo = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all receipts', () => {
    const findAllData = service.getReceipts();
    expect(findAllData).toBeTruthy();
  });

  it('findOne Tuition function to be called', () => {
    const findOneData = service.findOneByTranID('');
    expect(findOneData).toBeTruthy();
  });

  it('findOne Tuition By ID function to call', () => {
    const event = new Receipt();

    const findOneData = service.getReceipt('');
    expect(findOneData).toBeTruthy();
  });

  it('create receipt funciton to be call', () => {
    const event = new Receipt();

    const createData = service.createReceipt(event);

    expect(createData).toBeTruthy();
  });

  it('remove receipt function to be called', () => {
    const findRemoveData = service.deleteReceipt('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('update function to be called', () => {
    const event = new Receipt();

    jest.spyOn(receiptRepo, 'update').mockImplementation();

    const updateData = service.updateReceipt('', event);

    expect(updateData).toBeTruthy();
  });
});
