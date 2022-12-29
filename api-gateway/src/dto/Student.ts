import { ApiProperty } from '@nestjs/swagger';
import { Tuition } from './Tuition';

export class Student {
  @ApiProperty()
  id: string;
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  studentID: string;
  @ApiProperty()
  grade: number;
  @ApiProperty()
  mobileNumber: string;
  @ApiProperty()
  schoolName: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
