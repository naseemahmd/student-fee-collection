import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { TuitionController } from './tuition.controller';
import { TuitionService } from './tuition.service';
import { Tuition } from './tutition.entity';

describe('TuitionController', () => {
  let service: TuitionService;
  let controller: TuitionController;

  let tuitionRepo: Repository<Tuition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TuitionController],
      providers: [
        TuitionService,
        {
          provide: PinoLogger,
          useFactory: () => {
            const logger: PinoLogger = new PinoLogger({});
            logger.setContext('TuitionService');
            return logger;
          },
        },
        {
          provide: getRepositoryToken(Tuition),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TuitionService>(TuitionService);
    controller = module.get<TuitionController>(TuitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all getTuitions', async () => {
    const result = [new Tuition()];

    jest.spyOn(service, 'getTuitions').mockImplementation(async () => result);

    const findAllData = await controller.findAll();
    expect(findAllData).toEqual(result);
  });

  it('create tuition function called', async () => {
    const result = new Tuition();

    jest.spyOn(service, 'createTuition').mockImplementation(async () => result);

    const createData = await controller.create(result);

    expect(createData).toEqual(result);
  });

  it('findOne Tuition function called', async () => {
    const result = new Tuition();
    jest.spyOn(service, 'findOne').mockImplementation(async () => result);

    const findOneData = await controller.findOne('');
    expect(findOneData).toEqual(result);
  });

  it('remove tuition function to called', async () => {
    let result;
    jest.spyOn(service, 'remove').mockImplementation(async () => result);

    expect(await controller.remove(' ')).toEqual(result);
  });

  it('update tuition function to called', async () => {
    let result;

    jest.spyOn(service, 'editTuition').mockImplementation(async () => result);

    const updateData = await controller.editTuitionId({
      id: 'id',
      tuition: result,
    });

    expect(updateData).toEqual(result);
  });
});
