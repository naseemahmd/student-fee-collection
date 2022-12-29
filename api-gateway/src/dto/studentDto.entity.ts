import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  grade: number;
  @ApiProperty()
  mobileNumber: string;
  @ApiProperty()
  schoolName: string;
}
