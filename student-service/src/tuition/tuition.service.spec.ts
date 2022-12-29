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

  it('should return all getTuitions', () => {
    const findAllData = service.getTuitions();
    expect(findAllData).toBeTruthy();
  });

  it('create tuition function called', () => {
    const event = new Tuition();

    const createData = service.createTuition(event);

    expect(createData).toBeTruthy();
  });

  it('findOne Tuition function called', () => {
    const event = new Tuition();

    const findOneData = service.findOne('');
    expect(findOneData).toBeTruthy();
  });

  it('findOne Tuition By ID function called', () => {
    const event = new Tuition();

    const findOneData = service.findOneByID('');
    expect(findOneData).toBeTruthy();
  });

  it('remove tuition function to called', () => {
    const findRemoveData = service.remove('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('update tuition function to called', () => {
    const event = new Tuition();
    event.tuitionFee = 230;

    const tuitionFee = event.tuitionFee;

    jest.spyOn(tuitionRepo, 'update').mockImplementation();

    const updateData = service.editTuition('', event);

    expect(updateData).toBeTruthy();
  });
});
