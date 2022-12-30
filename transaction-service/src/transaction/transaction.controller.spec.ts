import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Receipt } from '../receipt/dto/receipt.entity';
import { ReceiptService } from '../receipt/receipt.service';
import { Repository } from 'typeorm';
import { Transaction } from './dto/transaction.entity';
import { TransactionService } from './transaction.service';
import { GetFee } from './dto/getFee';
import { TransactionController } from './transaction.controller';

describe('TransactionController', () => {
  let service: TransactionService;
  let httpService: HttpService;
  let resService: ReceiptService;
  let controll: TransactionController;

  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
  };
  let receiptRepo: Repository<Receipt>;
  let transactionRepo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
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
    resService = module.get<ReceiptService>(ReceiptService);
    controll = module.get<TransactionController>(TransactionController);
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    receiptRepo = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all trasactions', async () => {
    const result = [new Transaction()];
    jest
      .spyOn(service, 'getTransactions')
      .mockImplementation(async () => result);

    const findAllData = await controll.findAll();
    expect(findAllData).toEqual(result);
  });

  it('findOne transaction function to be called', async () => {
    const result = new Transaction();
    jest.spyOn(service, 'findOne').mockImplementation(async () => result);

    const findOneData = await controll.findOne('id');
    expect(findOneData).toEqual(result);
  });

  it('Get Fee Details should return', async () => {
    const result = new GetFee();
    jest.spyOn(service, 'getFee').mockImplementation(async () => result);

    const findOneData = await controll.getFee({ studentID: '' });
    expect(findOneData).toBeTruthy();
  });

  it('create transaction should be called', async () => {
    const result = new Transaction();

    jest.spyOn(service, 'collectFee').mockImplementation(async () => result);

    const createData = await controll.create(result);

    expect(createData).toEqual(result);
  });

  it('remove function to should called', async () => {
    const result = new Transaction();
    let responce;
    jest.spyOn(service, 'deleteFee').mockImplementation(async () => responce);
    const findRemoveData = await controll.remove('1');
    expect(findRemoveData).toEqual(responce);
  });

  it('update function should be called', async () => {
    const event = new Transaction();
    let responce;
    jest.spyOn(service, 'editFee').mockImplementation(async () => responce);

    const updateData = await controll.editFee({ id: '', transaction: event });

    expect(updateData).toEqual(responce);
  });
});
