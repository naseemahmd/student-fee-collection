import { ApiProperty } from '@nestjs/swagger';
import { Tuition } from './Tuition';

export class StudentWithTuition {
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
  @ApiProperty({ type: () => [Tuition] })
  tuitions: Tuition[];
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
