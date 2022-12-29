import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { TuitionService } from 'src/tuition/tuition.service';
import { Tuition } from 'src/tuition/tutition.entity';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Tuition]),
    LoggerModule.forRoot(),
  ],
  controllers: [StudentController],
  providers: [StudentService, TuitionService],
})
export class StudentModule {}
