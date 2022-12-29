import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @MessagePattern('getAllStudents')
  findAllStudent() {
    return this.studentService.getStudents();
  }

  @MessagePattern('getOneStudent')
  async findOne(@Body() body: any) {
    return await this.studentService.findOneStudent(body.id);
  }

  @MessagePattern('getOneStudentWithTuition')
  async getOneStudentWithTuition(@Body() body: any) {
    if (body.id) {
      return await this.studentService.getOneStudentWithTuition(body.id);
    } else {
      return await this.studentService.getOneStudentWithTuitionStudentID(
        body.studentID,
      );
    }
  }

  @MessagePattern('registerStudent')
  async registerStudent(@Body() student: Student) {
    return await this.studentService.registerStudent(student);
  }

  @MessagePattern('assignTuition')
  async asignTuition(@Body() body: any) {
    return await this.studentService.asignTuition(body.id, body.tuitionID);
  }

  @MessagePattern('updateStudent')
  async editStudent(@Body() body: any) {
    return await this.studentService.updateStudent(body.id, body.student);
  }
  @MessagePattern('unregisterStudent')
  async remove(@Body() id: string) {
    return await this.studentService.unResigerStudent(id);
  }
}
