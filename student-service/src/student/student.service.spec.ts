import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { TuitionService } from '../tuition/tuition.service';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { Tuition } from '../tuition/tutition.entity';

describe('StudentService', () => {
  let service: StudentService;

  const repositoryMock = {
    createQueryBuilder: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  };
  let studentRepo: Repository<Student>;
  let tuitionRepo: Repository<Tuition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      providers: [
        StudentService,
        TuitionService,
        {
          provide: getRepositoryToken(Tuition),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: repositoryMock,
        },
        {
          provide: PinoLogger,
          useFactory: () => {
            const logger: PinoLogger = new PinoLogger({});
            logger.setContext('StudentService');
            return logger;
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    tuitionRepo = module.get<Repository<Tuition>>(getRepositoryToken(Tuition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('get All Students function to called', () => {
    const findAllData = service.getStudents();
    expect(findAllData).toBeTruthy();
  });

  it('create function to called', () => {
    const event = new Student();

    const createData = service.registerStudent(event);

    expect(createData).toBeTruthy();
  });

  it('findOne Student function to caleed', () => {
    const findOneData = service.findOneStudent('');
    expect(findOneData).toBeTruthy();
  });

  it('findOne Student with Tuition By ID function to call', () => {
    const findOneData = service.getOneStudentWithTuition('');
    expect(findOneData).toBeTruthy();
  });
  it('findOne Student with Tuituin By StudenID function to call', () => {
    const findOneData = service.getOneStudentWithTuitionStudentID('');
    expect(findOneData).toBeTruthy();
  });

  it('UnRegister student function to called', () => {
    const findRemoveData = service.unResigerStudent('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('update Student function to called', () => {
    const event = new Student();
    event.schoolName = 'Primary Oxford';

    const tuitionFee = event.schoolName;

    jest.spyOn(studentRepo, 'update').mockImplementation();

    const updateData = service.updateStudent('', event);

    expect(updateData).toBeTruthy();
  });

  it('AssignTution function to called', () => {
    const event = new Student();

    const createData = service.asignTuition('id', 'tutionID');

    expect(createData).toBeTruthy();
  });
});
