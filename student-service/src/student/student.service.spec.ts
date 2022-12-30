import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { TuitionService } from '../tuition/tuition.service';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { Tuition } from '../tuition/tutition.entity';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;

  const repositoryMock = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    findBy: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  };
  let studentRepo: Repository<Student>;
  let tuitionRepo: Repository<Tuition>;
  let logger: PinoLogger;
  let tuitionService: TuitionService;
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
    tuitionService = module.get<TuitionService>(TuitionService);
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    tuitionRepo = module.get<Repository<Tuition>>(getRepositoryToken(Tuition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get All Students function to called', async () => {
    const result = [];

    jest.spyOn(studentRepo, 'find').mockImplementation(async () => result);

    const findAllData = await service.getStudents();

    expect(findAllData).toEqual(result);
  });

  it('get All Students function should be Error', async () => {
    jest
      .spyOn(studentRepo, 'find')
      .mockRejectedValue(new Error('Issue on fetching Student'));

    const findAllData = await service.getStudents();

    expect(findAllData).toEqual(new Error('Issue on fetching Student'));
  });

  it('findOne Student function to called', async () => {
    const result = new Student();

    jest.spyOn(studentRepo, 'findOneBy').mockImplementation(async () => result);

    const findOneData = await service.findOneStudent('');
    expect(findOneData).toEqual({ ...result });
  });

  it('findOne Student function to called error', async () => {
    const result = new Student();

    jest
      .spyOn(studentRepo, 'findOneBy')
      .mockRejectedValue(new Error('Issue on fetching Student'));

    const findOneData = await service.findOneStudent('');
    expect(findOneData).toEqual(new Error('Issue on fetching Student'));
  });

  it('findOne Student with Tuition By ID function to call', async () => {
    const result = new Student();

    jest.spyOn(studentRepo, 'createQueryBuilder').mockImplementation();

    const findOneData = await service.getOneStudentWithTuition('');
    expect(findOneData).toEqual(result);
  });

  it('findOne Student with Tuituin By StudenID function to call', async () => {
    const result = new Student();

    jest.spyOn(studentRepo, 'createQueryBuilder').mockReturnThis();

    const findOneData = await service.getOneStudentWithTuitionStudentID('');
    expect(findOneData).toBeTruthy();
  });

  it('create function to called without studentID', async () => {
    const result = new Student();
    const lastNo = [];
    jest.spyOn(studentRepo, 'findBy').mockImplementation(async () => lastNo);

    const nextNo = Number('id');
    const studentID = nextNo;

    jest.spyOn(studentRepo, 'save').mockImplementation(async () => result);
    const createData = await service.registerStudent(result);

    expect(createData).toBeTruthy();
  });

  it('create function to called with studentID', async () => {
    const result = new Student();
    let studentID = '';
    const lastNo = [];
    jest.spyOn(studentRepo, 'findBy').mockImplementation(async () => [result]);

    studentID = `grd0${result.grade}:1001`;

    jest.spyOn(studentRepo, 'save').mockImplementation(async () => result);
    const createData = await service.registerStudent(result);

    expect(createData).toBeTruthy();
  });

  it('create function to error', async () => {
    const result = new Student();
    result.studentID = '';
    jest
      .spyOn(studentRepo, 'save')
      .mockRejectedValue(new Error('Issue on Registering the Student'));
    const createData = await service.registerStudent(result);

    expect(createData).toEqual(new Error('Issue on Registering the Student'));
  });

  it('update Student function to called', async () => {
    const event = new Student();
    const editStudent = new Student();
    editStudent.schoolName = 'Primary Oxford';

    jest
      .spyOn(studentRepo, 'findOneBy')
      .mockImplementation(async () => editStudent);

    jest.spyOn(studentRepo, 'update').mockImplementation();

    const updateData = await service.updateStudent('', event);
    jest
      .spyOn(studentRepo, 'findOneBy')
      .mockImplementation(async () => editStudent);

    expect(updateData).toBeTruthy();
  });

  it('update Student function to called with wrongID', async () => {
    const event = new Student();
    const editStudent = null;
    event.schoolName = 'Primary Oxford';

    jest.spyOn(studentRepo, 'findOneBy').mockImplementation(async () => null);

    if (!editStudent) {
      jest.spyOn(studentRepo, 'update').mockImplementation();
      const updateData = await service.updateStudent('', editStudent);
      expect(updateData).toEqual(new NotFoundException('Student is not found'));
    }
  });

  it('update Student function to called error', async () => {
    const event = new Student();
    event.schoolName = 'Primary Oxford';
    const editStudent = new Student();
    editStudent.schoolName = 'Primary Oxford';

    jest
      .spyOn(studentRepo, 'findOneBy')
      .mockImplementation(async () => editStudent);

    jest
      .spyOn(studentRepo, 'update')
      .mockRejectedValue(new Error('Failed to Upadate Student'));

    const updateData = await service.updateStudent('', event);

    expect(updateData).toEqual(new Error('Failed to Upadate Student'));
  });

  it('AssignTution function to called', async () => {
    const result = new Student();
    const tuition = new Tuition();
    jest
      .spyOn(service, 'getOneStudentWithTuition')
      .mockImplementation(async () => result);

    jest
      .spyOn(tuitionService, 'findOneByID')
      .mockImplementation(async () => tuition);

    jest.spyOn(studentRepo, 'save').mockImplementation(async () => result);

    jest
      .spyOn(service, 'getOneStudentWithTuitionStudentID')
      .mockImplementation(async () => result);

    const createData = await service.asignTuition('id', 'tutionID');

    expect(createData).toBeTruthy();
  });

  it('UnRegister student function to called', async () => {
    const result = new Student();

    jest.spyOn(studentRepo, 'delete').mockImplementation();

    const findRemoveData = await service.unResigerStudent('1');
    expect(findRemoveData).toBeTruthy();
  });

  it('UnRegister student function to called error', async () => {
    const result = new Student();

    jest
      .spyOn(studentRepo, 'delete')
      .mockRejectedValue(new Error('Failed to Assign Tuiton'));

    const findRemoveData = await service.unResigerStudent('1');
    expect(findRemoveData).toEqual(new Error('Failed to Assign Tuiton'));
  });
});
