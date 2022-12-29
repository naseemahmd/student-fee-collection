import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { StudentDto } from './dto/studentDto.entity';
import { StudentService } from './student.service';
import { TransactionDto } from './dto/transactionDto.entity';
import { TransactionService } from './transaction.service';
import { TuitionDto } from './dto/tuitionDto.entity';
import { Student } from './dto/Student';
import { StudentWithTuition } from './dto/StudentWithTuition';
import { Observable } from 'rxjs';
import { AssignTuition, GetFee } from './dto/bodyDto';
import { Tuition } from './dto/Tuition';
import { ReceiptDTO } from './dto/Receipt';
import { Transaction } from './dto/Transaction';

@Controller()
export class AppController {
  constructor(
    private readonly studentService: StudentService,
    private readonly transactionService: TransactionService,
  ) {}

  //Get All Students
  @ApiResponse({
    status: 200,
    description: 'The list of Students',
    type: [Student],
  })
  @Get('getStudents')
  getAllStudents() {
    return this.studentService.getAllStudents();
  }

  //Get one student
  @ApiResponse({
    status: 200,
    description: 'The one student with id',
    type: Student,
  })
  @Get('getOneStudent/:id')
  findOne(@Param('id') id: string) {
    return this.studentService.getOneStudent(id);
  }

  //Get one student with tuituins
  @ApiResponse({
    status: 200,
    description: 'The one student with tuitions id',
    type: StudentWithTuition,
  })
  @Get('getOneStudentWithTuition/:id')
  getOneStudentWithTuition(@Param('id') id: string) {
    return this.studentService.getOneStudentWithTuition(id);
  }

  //Get one student with tuituins for studentID
  @ApiResponse({
    status: 200,
    description: 'The one student with tuitions StudentID',
    type: StudentWithTuition,
  })
  @Get('getStudentWithStudentID/:studentID')
  getStudentWithStudentID(@Param('studentID') studentID: string) {
    return this.studentService.getStudentWithStudentID(studentID);
  }

  //Regiter Student / Create Student
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register')
  registerStudent(@Body() student: StudentDto): Observable<Student> {
    return this.studentService.registerStudent(student);
  }

  //Update Student
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully updated.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Student Not Found' })
  @Post('upadteStudent/:id')
  upadteStudent(
    @Body() student: StudentDto,
    @Param('id') id: string,
  ): Observable<Student> {
    return this.studentService.updateStudent(student, id);
  }

  //Assing Tuition for Students
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully Deleted.',
    type: StudentWithTuition,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Student Not Found' })
  @Post('assignTuition/:id')
  assignTuition(
    @Body() body: AssignTuition,
    @Param('id') id: string,
  ): Observable<StudentWithTuition> {
    return this.studentService.asignTuition(id, body.tuitionID);
  }

  // Delete Student
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Student Not Found' })
  @Delete('deleteStudent/:id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.unRegisterStudent(id);
  }

  // Get All Tuitions
  @ApiResponse({
    status: 200,
    description: 'The list of Tuition',
    type: [Tuition],
  })
  @Get('getTuitions')
  getTuitions(): Observable<Tuition[]> {
    return this.studentService.getTuitions();
  }

  // Get One Tuition
  @ApiResponse({
    status: 200,
    description: 'The Tuition with ID',
    type: Tuition,
  })
  @Get('getOneTuition/:id')
  getOneTuition(@Param('id') id: string): Observable<Tuition> {
    return this.studentService.getOneTuition(id);
  }

  // Create Tuition
  @ApiResponse({
    status: 201,
    description: 'The tuiton has been successfully created.',
    type: Tuition,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('createTuition')
  createTuition(@Body() tuition: TuitionDto): Observable<Tuition> {
    return this.studentService.createTuition(tuition);
  }

  // Update Tuition
  @ApiResponse({
    status: 201,
    description: 'The tuiton has been successfully updated.',
    type: Tuition,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Tuition Not Found' })
  @Post('updateTuition/:id')
  updateTuition(
    @Body() tuition: TuitionDto,
    @Param('id') id: string,
  ): Observable<Tuition> {
    return this.studentService.updateTuition(tuition, id);
  }

  //Delete Tuition
  @ApiResponse({
    status: 201,
    description: 'The tuiton has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Tuition Not Found' })
  @Delete('deleteTuition/:id')
  deleteTuition(@Param('id') id: string) {
    return this.studentService.deleteTuition(id);
  }

  //Get Fee for a Student
  @ApiResponse({
    status: 200,
    description: 'The Fee deatils of Student',
    type: GetFee,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getFee/:studentID')
  getFee(@Param('studentID') studentID: string): Observable<GetFee> {
    return this.transactionService.getFee(studentID);
  }

  // @Get('getReceipts')
  // getReceipts() {
  //   return this.transactionService.getReceipts();
  // }

  //Get Final Recipt
  @ApiResponse({
    status: 200,
    description: 'The Receipt for a Student for Transaction',
    type: ReceiptDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getReceipt/:transactionID')
  getOneReceipt(
    @Param('transactionID') transactionID: string,
  ): Observable<ReceiptDTO> {
    return this.transactionService.getOneReceipt(transactionID);
  }

  //Get All Transactions
  @ApiResponse({
    status: 200,
    description: 'The List of Trasaction/Fee',
    type: [Transaction],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getTransactions')
  getTransactions(): Observable<Transaction[]> {
    return this.transactionService.getTransactions();
  }

  //  Get One Transaction
  @ApiResponse({
    status: 200,
    description: 'The One of Trasaction/Fee',
    type: Transaction,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getOneTransaction/:id')
  getOneTransaction(@Param('id') id: string): Observable<Transaction> {
    return this.transactionService.getOneTransaction(id);
  }

  // Collect Fee / Create Transaction
  @ApiResponse({
    status: 201,
    description: 'Collete Fee / Create Transaction is Sucuss',
    type: Transaction,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('collectFee')
  createTransaction(
    @Body() transaction: TransactionDto,
  ): Observable<Transaction> {
    return this.transactionService.createTransaction(transaction);
  }

  //Update Fee / Update Transaction
  @ApiResponse({
    status: 201,
    description: 'Update Fee / Update Transaction is Sucuss',
    type: Transaction,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Transaction Not Found' })
  @Post('updateFee/:id')
  upadteTransaction(
    @Body() transaction: TransactionDto,
    @Param('id') id: string,
  ): Observable<Transaction> {
    return this.transactionService.upadteTransaction(transaction, id);
  }

  // Return Fee / Delete Fee
  @ApiResponse({
    status: 201,
    description: 'Delete Fee / Delete Transaction is Sucuss',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Transaction Not Found' })
  @Delete('returnFee/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(id);
  }
}
