import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { TuitionService } from './tuition.service';
import { Tuition } from './tutition.entity';

describe('TuitionService', () => {
  let service: TuitionService;

  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    findBy: jest.fn((entity) => entity),
  };
  let tuitionRepo: Repository<Tuition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      providers: [
        TuitionService,
        {
          provide: getRepositoryToken(Tuition),
          useValue: repositoryMock,
        },
        {
          provide: PinoLogger,
          useFactory: () => {
            const logger: PinoLogger = new PinoLogger({});
            logger.setContext('TuitionService');
            return logger;
          },
        },
      ],
    }).compile();

    service = module.get<TuitionService>(TuitionService);
    tuitionRepo = module.get<Repository<Tuition>>(getRepositoryToken(Tuition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all getTuitions', async () => {
    const result = [];

    jest.spyOn(tuitionRepo, 'find').mockImplementation(async () => result);

    const findAllData = await service.getTuitions();
    expect(findAllData).toEqual(result);
  });

  it('should return all getTuitions error', async () => {
    const result = [];

    jest
      .spyOn(tuitionRepo, 'find')
      .mockRejectedValue(
        new Error('Issue on geting tuition! Please Try Again'),
      );

    const findAllData = await service.getTuitions();
    expect(findAllData).toEqual(
      new Error('Issue on geting tuition! Please Try Again'),
    );
  });

  it('create tuition function called', async () => {
    const result = new Tuition();

    jest.spyOn(tuitionRepo, 'save').mockImplementation(async () => result);

    const createData = await service.createTuition(result);

    expect(createData).toEqual(result);
  });

  it('create tuition function called error', async () => {
    const result = new Tuition();

    jest
      .spyOn(tuitionRepo, 'save')
      .mockRejectedValue(
        new Error('Issue on create tuition! Please Try Again'),
      );

    const createData = await service.createTuition(result);

    expect(createData).toEqual(
      new Error('Issue on create tuition! Please Try Again'),
    );
  });

  it('findOne Tuition function called', async () => {
    const result = new Tuition();
    jest.spyOn(tuitionRepo, 'findOneBy').mockImplementation(async () => result);

    const findOneData = await service.findOne('');
    expect(findOneData).toEqual(result);
  });

  it('findOne Tuition function called error', async () => {
    const result = new Tuition();
    jest
      .spyOn(tuitionRepo, 'findOneBy')
      .mockRejectedValue(new Error('Issue on fetching Tuition'));

    const findOneData = await service.findOne('');
    expect(findOneData).toEqual(new Error('Issue on fetching Tuition'));
  });

  it('findOne Tuition By ID function called', async () => {
    const result = [];

    jest.spyOn(tuitionRepo, 'findBy').mockImplementation(async () => result);

    const findOneData = await service.findOneByID('');
    const returnRes = new Tuition();
    expect(findOneData).toEqual(returnRes);
  });

  it('findOne Tuition By ID function called error', async () => {
    const result = [];

    jest
      .spyOn(tuitionRepo, 'findBy')
      .mockRejectedValue(new Error('Issue on fetching Tuition'));

    const findOneData = await service.findOneByID('');
    expect(findOneData).toEqual(new Error('Issue on fetching Tuition'));
  });

  it('remove tuition function to called', async () => {
    const result = new Tuition();
    jest.spyOn(tuitionRepo, 'delete').mockImplementation();

    const findRemoveData = await service.remove('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('remove tuition function to called error', async () => {
    const result = new Tuition();
    jest
      .spyOn(tuitionRepo, 'delete')
      .mockRejectedValue(new Error('Error on Tuition Removed'));

    const findRemoveData = await service.remove('1');
    expect(findRemoveData).toEqual(new Error('Error on Tuition Removed'));
  });

  it('update tuition function to called', async () => {
    const result = new Tuition();
    const editTution = new Tuition();
    result.tuitionFee = 230;

    jest
      .spyOn(tuitionRepo, 'findOneBy')
      .mockImplementation(async () => editTution);

    jest.spyOn(tuitionRepo, 'update').mockImplementation();

    const updateData = await service.editTuition('', result);

    jest
      .spyOn(tuitionRepo, 'findOneBy')
      .mockImplementation(async () => editTution);

    expect(updateData).toBeTruthy();
  });

  it('update tuition function to called wrongID', async () => {
    const result = new Tuition();
    result.tuitionFee = 230;

    const tuitionFee = result.tuitionFee;

    jest.spyOn(tuitionRepo, 'findOneBy').mockImplementation(async () => null);

    jest.spyOn(tuitionRepo, 'update').mockImplementation();

    const updateData = await service.editTuition('', result);

    expect(updateData).toEqual(new NotFoundException('Tuition is not found'));
  });

  it('update tuition function to called error', async () => {
    const result = new Tuition();
    result.tuitionFee = 230;
    const editTution = new Tuition();
    result.tuitionFee = 230;

    jest
      .spyOn(tuitionRepo, 'findOneBy')
      .mockImplementation(async () => editTution);
    jest
      .spyOn(tuitionRepo, 'update')
      .mockRejectedValue(
        new Error('Issue on update tuition! Please Try Again'),
      );

    const updateData = await service.editTuition('', result);

    expect(updateData).toEqual(
      new Error('Issue on update tuition! Please Try Again'),
    );
  });
});
