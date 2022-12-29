import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TuitionService } from '../tuition/tuition.service';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private tuitionService: TuitionService,
    private _logger: PinoLogger,
  ) {
    _logger.setContext(StudentService.name);
  }

  // GET All Students
  async getStudents() {
    this._logger.info(`getStudent is called`);
    try {
      return await this.studentRepository.find();
    } catch (error) {
      this._logger.info(`getTransactions is error with ${error}`);
      return new Error('Issue on fetching Student');
    }
  }

  // GET One Student with Tuitions

  async getOneStudentWithTuition(id: string) {
    this._logger.info(`getStudent with tuition is called for ${id}`);

    try {
      const student = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.tuitions', 'tuition')
        .where('student.id = :id', { id: id })
        .getOne();

      this._logger.info(`getStudent with tuition for ${id} fetched`);

      return { ...student };
    } catch (error) {
      this._logger.info(
        `getStudent with tuition for ${id} error with ${error}`,
      );
      return new Error('Issue on fetching Student');
    }
  }

  // GET One Student with Tuitions for StudentID

  async getOneStudentWithTuitionStudentID(studentID: string) {
    this._logger.info(
      `getStudent with tuition is called for studentID ${studentID}`,
    );
    try {
      const student = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.tuitions', 'tuition')
        .where('student.studentID = :studentID', { studentID: studentID })
        .getOne();
      this._logger.info(
        `getStudent with tuition is called for studentID ${studentID} is fetched`,
      );

      return { ...student };
    } catch (error) {
      this._logger.info(
        `getStudent with tuition for ${studentID} error with ${error}`,
      );
      return new Error('Issue on fetching Student');
    }
  }

  // GET One Student
  async findOneStudent(id: string) {
    this._logger.info(`getStudent is called for ${id}`);
    try {
      const respoonse = await this.studentRepository.findOneBy({ id: id });
      this._logger.info(`getStudent is called for ${id} feteched`);

      return { ...respoonse };
    } catch (error) {
      this._logger.info(`getStudent is called for ${id} error with ${id}`);
      return new Error('Issue on fetching Student');
    }
  }

  // Create Student
  async registerStudent(student: Student) {
    this._logger.info(
      `registerStudent is called with ${JSON.stringify(student)}`,
    );
    try {
      const lastNo: Student[] = await this.studentRepository.findBy({
        grade: student.grade,
      });
      let studentID = '';
      if (lastNo.length > 0) {
        const nextNo: number =
          Number(lastNo[lastNo.length - 1].studentID.split(':')[1]) + 1;
        studentID = `${
          lastNo[lastNo.length - 1].studentID.split(':')[0]
        }/${nextNo}`;
      } else {
        studentID = `grd0${student.grade}:1001`;
      }
      student.studentID = studentID;

      const registeredStudent = await this.studentRepository.save(student);
      this._logger.info(`registerStudent is called is Succuess`);
      return { ...registeredStudent };
    } catch (error) {
      this._logger.info(`registerStudent is error with ${error}`);
      return new Error('Issue on Registering the Student');
    }
  }

  // Update Student
  async updateStudent(id: string, student: Student) {
    this._logger.info(`updateStudent is called for ${id}`);
    try {
      const editStudent = await this.studentRepository.findOneBy({ id: id });

      if (!editStudent) {
        this._logger.info(`student is not found for ${id}`);
        return new NotFoundException('Student is not found');
      }

      await this.studentRepository.update(id, student);
      const editedStudent = await this.studentRepository.findOneBy({ id: id });
      this._logger.info(`updateStudet is called is sucuss`);
      return { ...editedStudent };
    } catch (error) {
      this._logger.info(`updateStudet is called error with ${error}`);
      return new Error('Failed to Upadate Student');
    }
  }

  // Asing Tuition for Student
  async asignTuition(id: string, tuitionID: string) {
    this._logger.info(`asignTuition is called for ${id} with ${tuitionID}`);
    try {
      const editStudent: any = await this.getOneStudentWithTuition(id);
      const tuition: any = await this.tuitionService.findOneByID(tuitionID);
      const tuitionList = editStudent.tuitions;

      tuitionList.push(tuition);
      editStudent.tuitions = tuitionList;

      await this.studentRepository.save(editStudent);
      const editedStudent = await this.getOneStudentWithTuitionStudentID(
        editStudent.studentID,
      );
      this._logger.info(
        `asignTuition is called for ${id} with ${tuitionID} is updated`,
      );
      return { ...editedStudent };
    } catch (error) {
      this._logger.info(
        `asignTuition is called for ${id} with ${tuitionID} is error with ${error}`,
      );
      return new Error('Failed to Assign Tuiton');
    }
  }

  // delete for Student
  async unResigerStudent(id: string) {
    this._logger.info(`unResigerStudent is called for ${id}`);
    try {
      await this.studentRepository.delete(id);
      this._logger.info(`unResigerStudent is called for ${id} sucuess`);
      return 'Student is UnRegistered';
    } catch (error) {
      this._logger.info(
        `unResigerStudent is called for ${id} error with ${error}`,
      );
      return new Error('Failed to Assign Tuiton');
    }
  }
}
