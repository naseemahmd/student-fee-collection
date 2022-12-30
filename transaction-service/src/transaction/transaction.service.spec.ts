import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Receipt } from '../receipt/dto/receipt.entity';
import { ReceiptService } from '../receipt/receipt.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Transaction } from './dto/transaction.entity';
import { TransactionService } from './transaction.service';
import { GetFee } from './dto/getFee';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpService: HttpService;
  let resService: ReceiptService;

  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
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
    resService = module.get<ReceiptService>(ReceiptService);

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
    jest.spyOn(transactionRepo, 'find').mockImplementation(async () => result);

    const findAllData = await service.getTransactions();
    expect(findAllData).toEqual(result);
  });

  it('should return all trasactions Error', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'find')
      .mockRejectedValue(
        new Error('We Have Issue on Fetching! Please Try Again'),
      );
    const findAllData = await service.getTransactions();
    expect(findAllData).toEqual(
      new Error('We Have Issue on Fetching! Please Try Again'),
    );
  });

  it('findOne transaction function to be called', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'findOneBy')
      .mockImplementation(async () => result);

    const findOneData = await service.findOne('');
    expect(findOneData).toEqual(result);
  });

  it('findOne transaction function to be called no transactions', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'findOneBy')
      .mockImplementation(async () => null);

    const findOneData = await service.findOne('');
    expect(findOneData).toEqual(
      new NotFoundException('Transaction is not found'),
    );
  });

  it('findOne transaction function to be called error', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'findOneBy')
      .mockRejectedValue(
        new Error('We Have Issue on Fetching! Please Try Again'),
      );

    const findOneData = await service.findOne('');
    expect(findOneData).toEqual(
      new Error('We Have Issue on Fetching! Please Try Again'),
    );
  });

  it('Get Fee Details should return', async () => {
    const result = new GetFee();
    const findOneData = await service.getFee('');
    expect(findOneData).toBeTruthy();
  });

  // it('Get Fee Details should return', () => {
  //   const result = new GetFee()
  //   const findOneData = await service.getFee('2');
  //   expect(findOneData).toEqual(new Error('We Have Issue on Fetching! Please Try Again'));
  // });

  it('Should Get transaction Details by Id', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockImplementation(async () => result);

    const findOneData = await service.getTransactionById('');
    expect(findOneData).toEqual(result);
  });

  it('Should Get transaction Details by Id Error', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockRejectedValue(
        new Error('We Have Issue on Fetching! Please Try Again'),
      );

    const findOneData = await service.getTransactionById('');
    expect(findOneData).toEqual(
      new Error('We Have Issue on Fetching! Please Try Again'),
    );
  });

  it('create transaction should be called no old data', async () => {
    const result = new Transaction();
    const receipts = new Receipt();
    const lastNo = [];
    let TransactionID = '';
    jest.spyOn(transactionRepo, 'find').mockImplementation(async () => lastNo);
    TransactionID = 'Trans:1001';
    jest.spyOn(transactionRepo, 'save').mockImplementation(async () => result);

    let reciptID = '';

    jest.spyOn(resService, 'getReceipts').mockResolvedValue([receipts]);

    reciptID = 'Recp:1001';

    jest
      .spyOn(resService, 'createReceipt')
      .mockImplementation(async () => receipts);

    const createData = await service.collectFee(result);

    expect(createData).toBeTruthy();
  });

  it('create transaction should be called', async () => {
    const result = new Transaction();
    const receipts = new Receipt();
    const lastResp = null;
    let TransactionID = '';
    jest
      .spyOn(transactionRepo, 'find')
      .mockImplementation(async () => [result]);
    TransactionID = 'Trans:1001';
    jest.spyOn(transactionRepo, 'save').mockImplementation(async () => result);

    let reciptID = '';
    jest.spyOn(resService, 'getReceipts').mockResolvedValue(null);

    reciptID = 'Recp:1001';

    jest
      .spyOn(resService, 'createReceipt')
      .mockImplementation(async () => receipts);

    const createData = await service.collectFee(result);

    expect(createData).toBeTruthy();
  });

  it('create transaction should be called Error', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'save')
      .mockRejectedValue(new Error('We Have Issue on creating Transaction'));

    const createData = await service.collectFee(result);

    expect(createData).toEqual(
      new Error('We Have Issue on creating Transaction'),
    );
  });

  it('create transaction should be called Receipt Error', async () => {
    const result = new Transaction();
    let TransactionID = '';
    let deleteResponse: DeleteResult;
    jest
      .spyOn(transactionRepo, 'find')
      .mockImplementation(async () => [result]);
    TransactionID = 'Trans:1001';
    jest.spyOn(transactionRepo, 'save').mockImplementation(async () => result);

    const reciptID = '';
    jest
      .spyOn(resService, 'getReceipts')
      .mockRejectedValue(new Error('We Have Issue on creating Transaction'));

    jest
      .spyOn(transactionRepo, 'delete')
      .mockImplementation(async () => deleteResponse);

    const createData = await service.collectFee(result);

    expect(createData).toEqual(
      new Error('We Have Issue on creating Transaction'),
    );
  });

  it('remove function to should called', async () => {
    const result = new Transaction();
    const receipt = new Receipt();
    let updateRes;
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockImplementation(async () => result);

    jest
      .spyOn(transactionRepo, 'update')
      .mockImplementation(async () => updateRes);

    jest
      .spyOn(resService, 'findOneByTranID')
      .mockImplementation(async () => receipt);

    jest
      .spyOn(resService, 'updateReceipt')
      .mockImplementation(async () => receipt);

    const findRemoveData = await service.deleteFee('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('remove function to should called', async () => {
    const result = new Transaction();
    jest
      .spyOn(transactionRepo, 'update')
      .mockRejectedValue(new Error('We Have Issue on creating Transaction'));

    const findRemoveData = await service.deleteFee('1');
    expect(findRemoveData).toEqual(
      new Error('We Have Issue on Deleting Transaction'),
    );
  });

  it('update function should be called', async () => {
    const result = new Transaction();
    let updateRes: UpdateResult;
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockImplementation(async () => result);

    jest
      .spyOn(transactionRepo, 'update')
      .mockImplementation(async () => updateRes);

    const updateData = await service.editFee('', result);

    expect(updateData).toEqual(result);
  });

  it('update function should be called no Receipt', async () => {
    const result = new Transaction();
    let updateRes: UpdateResult;
    jest.spyOn(transactionRepo, 'findOne').mockImplementation(async () => null);

    jest
      .spyOn(transactionRepo, 'update')
      .mockImplementation(async () => updateRes);

    const updateData = await service.editFee('', result);

    expect(updateData).toEqual(
      new NotFoundException('Transaction is not found'),
    );
  });

  it('update function should be called error', async () => {
    const result = new Transaction();
    let updateRes: UpdateResult;
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockImplementation(async () => result);

    jest
      .spyOn(transactionRepo, 'update')
      .mockRejectedValue(new Error('We Have Issue on updating Transaction'));

    const updateData = await service.editFee('', result);

    expect(updateData).toEqual(
      new Error('We Have Issue on updating Transaction'),
    );
  });
});
