import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { TuitionService } from '../tuition/tuition.service';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { Tuition } from '../tuition/tutition.entity';
import { StudentController } from './student.controller';

describe('StudentController', () => {
  let service: StudentService;
  let controller: StudentController;

  let studentRepo: Repository<Student>;
  let tuitionRepo: Repository<Tuition>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        TuitionService,
        {
          provide: getRepositoryToken(Tuition),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {},
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
    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get All Students function to called', async () => {
    const result = [];

    jest.spyOn(service, 'getStudents').mockImplementation(async () => result);

    const findAllData = await controller.findAllStudent();

    expect(findAllData).toEqual(result);
  });

  it('findOne Student function to called', async () => {
    const result = new Student();

    jest
      .spyOn(service, 'findOneStudent')
      .mockImplementation(async () => result);

    const findOneData = await controller.findOne('');
    expect(findOneData).toEqual({ ...result });
  });

  it('findOne Student with Tuition By ID function to call', async () => {
    const result = new Student();

    jest
      .spyOn(service, 'getOneStudentWithTuition')
      .mockImplementation(async () => result);
    result.id = 'id';
    const findOneData = await controller.getOneStudentWithTuition({
      id: result.id,
    });
    expect(findOneData).toBeTruthy();
  });

  it('findOne Student with Tuition By StudentID function to call', async () => {
    const result = new Student();

    jest
      .spyOn(service, 'getOneStudentWithTuition')
      .mockImplementation(async () => result);

    const findOneData = await controller.getOneStudentWithTuition({
      studentID: result.studentID,
    });
    expect(findOneData).toBeTruthy();
  });

  it('create function to called', async () => {
    const result = new Student();

    jest
      .spyOn(service, 'registerStudent')
      .mockImplementation(async () => result);

    const createData = await controller.registerStudent(result);

    expect(createData).toEqual(result);
  });

  it('update Student function to called', async () => {
    let result;
    const student = new Student();

    jest.spyOn(service, 'updateStudent').mockImplementation(async () => result);

    const updateData = await controller.editStudent({
      id: '',
      student: student,
    });

    expect(updateData).toEqual(result);
  });

  it('AssignTution function to called', async () => {
    const result = new Student();
    result.tuitions = result.tuitions;

    jest.spyOn(service, 'asignTuition').mockImplementation(async () => result);

    const createData = await controller.asignTuition({
      id: 'id',
      tuitionID: 'tutionID',
    });

    expect(createData).toEqual(result);
  });

  it('UnRegister student function to called', async () => {
    let result;

    jest
      .spyOn(service, 'unResigerStudent')
      .mockImplementation(async () => result);

    const findRemoveData = await controller.remove('1');
    expect(findRemoveData).toEqual(result);
  });
});
