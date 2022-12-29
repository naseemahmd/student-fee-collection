import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { StudentDto } from './dto/studentDto.entity';
import { TuitionDto } from './dto/tuitionDto.entity';

@Injectable()
export class StudentService {
  // Student Service Client
  constructor(@Inject('STUDENT_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    const topis = [
      'getAllStudents',
      'getOneStudent',
      'registerStudent',
      'updateStudent',
      'unregisterStudent',
      'getOneTuition',
      'createTuition',
      'updateTuition',
      'DeleteTuition',
      'getAllTuitions',
      'assignTuition',
      'getOneStudentWithTuition',
      'getStudentWithStudentID',
    ];
    topis.forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }

  getAllStudents() {
    return this.client.send('getAllStudents', {});
  }

  async getOneStudent(id: string) {
    return this.client.send('getOneStudent', { id: id });
  }
  getOneStudentWithTuition(id: string) {
    return this.client.send('getOneStudentWithTuition', { id: id });
  }

  getStudentWithStudentID(studentID: string) {
    return this.client.send('getOneStudentWithTuition', {
      studentID: studentID,
    });
  }

  registerStudent(student: StudentDto) {
    return this.client.send('registerStudent', { ...student });
  }
  updateStudent(student: StudentDto, id: string) {
    return this.client.send('updateStudent', { student: student, id: id });
  }
  asignTuition(id: string, tuitionID: string) {
    return this.client.send('assignTuition', { id, tuitionID });
  }
  unRegisterStudent(id: string) {
    return this.client.send('unregisterStudent', { id });
  }

  getTuitions() {
    return this.client.send('getAllTuitions', {});
  }
  getOneTuition(id: string) {
    return this.client.send('getOneTuition', { id: id });
  }
  createTuition(tuition: TuitionDto) {
    return this.client.send('createTuition', { ...tuition });
  }
  updateTuition(tuition: TuitionDto, id: string) {
    return this.client.send('updateTuition', { tuition: tuition, id: id });
  }
  deleteTuition(id: string) {
    return this.client.send('DeleteTuition', { id });
  }
}
