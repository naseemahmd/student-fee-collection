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

describe('ReceiptService', () => {
  let service: ReceiptService;
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
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    receiptRepo = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all receipts', async () => {
    const result = new Receipt();
    jest.spyOn(receiptRepo, 'find').mockImplementation(async () => [result]);

    const findAllData = await service.getReceipts();
    expect(findAllData).toEqual([result]);
  });

  it('should return all receipts Error', async () => {
    const result = new Receipt();
    jest
      .spyOn(receiptRepo, 'find')
      .mockRejectedValue(
        new Error('We Have Issue on Fetching! Please Try Again'),
      );
    const findAllData = await service.getReceipts();
    expect(findAllData).toEqual(
      new Error('We Have Issue on Fetching! Please Try Again'),
    );
  });

  it('findOne Tuition function to be called error', async () => {
    const result = new Receipt();
    jest
      .spyOn(receiptRepo, 'findOneBy')
      .mockRejectedValue(new Error('We Have Issue on finding transactions'));
    const findOneData = await service.findOneByTranID('');
    expect(findOneData).toEqual(
      new Error('We Have Issue on finding transactions'),
    );
  });

  it('findOne Tuition function to be called', async () => {
    const result = new Receipt();
    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => result);
    const findOneData = await service.findOneByTranID('');
    expect(findOneData).toEqual(result);
  });

  it('findOne Tuition function to be called Recipt not found', async () => {
    const result = new Receipt();
    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => null);
    const findOneData = await service.findOneByTranID('');

    expect(findOneData).toEqual(new NotFoundException('Receipt is not found'));
  });

  it('get Receipt for Transaction  ID function to call', async () => {
    const result = new ReceiptDTO();
    const receipt = new Receipt();
    const transaction = new Transaction();
    let httpRes: never;
    jest
      .spyOn(receiptRepo, 'findOneBy')
      .mockImplementation(async () => receipt);

    const respon: any = await firstValueFrom(httpMock.get());
    const student: any = respon.data;

    const finalReceipt = new ReceiptDTO();
    const studentRecpt = new StudentDto();
    const transactionDetail = new TransactionDto();
    const tutitionList: Purchase[] = [];
    jest
      .spyOn(transactionRepo, 'findOne')
      .mockImplementation(async () => transaction);
    // jest.spyOn(httpService, 'get').mockImplementation(async () => student);

    const findOneData = await service.getReceipt('');
    expect(findOneData).toBeTruthy();
  });

  // it('get Receipt for Transaction ID function to call no Receipt', async () => {
  //   const result = new ReceiptDTO();
  //   const receipt = null;
  //   let httpRes: never;

  //   jest
  //     .spyOn(receiptRepo, 'findOneBy')
  //     .mockImplementation(async () => receipt);
  //   // jest.spyOn(httpService, 'get').mockImplementation(async () => student);
  //   await firstValueFrom(httpMock.get());

  //   const findOneData = await service.getReceipt('');
  //   expect(findOneData).toEqual(new NotFoundException('Receipt is not found'));
  // });

  // it('get Receipt for Transaction ID function to call Error', async () => {
  //   const result = new ReceiptDTO();
  //   const receipt = new Receipt();
  //   const transaction = new Transaction();
  //   let student = new Student();

  //   jest
  //     .spyOn(receiptRepo, 'findOneBy')
  //     .mockImplementation(async () => receipt);

  //   const respon: any = await firstValueFrom(httpMock.get());
  //   student = respon.data;

  //   const finalReceipt = new ReceiptDTO();
  //   const studentRecpt = new StudentDto();
  //   const transactionDetail = new TransactionDto();
  //   const tutitionList: Purchase[] = [];

  //   jest
  //     .spyOn(transactionRepo, 'findOne')
  //     .mockRejectedValue(
  //       new Error('We Have Issue on Fetching! Please Try Again'),
  //     );
  //   // jest.spyOn(httpService, 'get').mockImplementation(async () => student);

  //   const findOneData = await service.getReceipt('');
  //   expect(findOneData).toEqual(result);
  // });

  it('create receipt funciton to be call', async () => {
    const result = new Receipt();
    // let response;
    jest.spyOn(receiptRepo, 'save').mockImplementation(async () => result);

    const createData = await service.createReceipt(result);

    expect(createData).toEqual(result);
  });

  it('create receipt funciton to be call error', async () => {
    const result = new Receipt();
    // let response;
    jest
      .spyOn(receiptRepo, 'save')
      .mockRejectedValue(new Error('We Have Issue on create Receipts'));

    const createData = await service.createReceipt(result);

    expect(createData).toEqual(new Error('We Have Issue on create Receipts'));
  });

  it('remove receipt function to be called', async () => {
    const result = new Receipt();
    const response = new DeleteResult();
    jest.spyOn(receiptRepo, 'delete').mockImplementation(async () => response);

    const findRemoveData = await service.deleteReceipt('1');
    expect(findRemoveData).toEqual(response);
  });

  it('remove receipt function to be called error', async () => {
    const result = new Receipt();
    const response = new DeleteResult();
    jest
      .spyOn(receiptRepo, 'delete')
      .mockRejectedValue(new Error('We Have Issue on delete Receipts'));

    const findRemoveData = await service.deleteReceipt('1');
    expect(findRemoveData).toEqual(
      new Error('We Have Issue on delete Receipts'),
    );
  });

  it('update function to be called', async () => {
    const event = new Receipt();
    const response = new UpdateResult();

    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => event);

    jest.spyOn(receiptRepo, 'update').mockImplementation(async () => response);

    const updateData = await service.updateReceipt('', event);
    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => event);

    expect(updateData).toEqual(event);
  });

  it('update function to be called error no receipt', async () => {
    const event = new Receipt();
    const response = null;
    const updateRes = new UpdateResult();

    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => null);

    jest.spyOn(receiptRepo, 'update').mockImplementation(async () => updateRes);

    const updateData = await service.updateReceipt('', event);

    expect(updateData).toEqual(new NotFoundException('Recipt is not found'));
  });

  it('update function to be called error', async () => {
    const event = new Receipt();
    const response = new UpdateResult();

    jest.spyOn(receiptRepo, 'findOneBy').mockImplementation(async () => event);

    jest
      .spyOn(receiptRepo, 'update')
      .mockRejectedValue(new Error('We Have Issue on update Receipts'));

    const updateData = await service.updateReceipt('', event);

    expect(updateData).toEqual(new Error('We Have Issue on update Receipts'));
  });
});
