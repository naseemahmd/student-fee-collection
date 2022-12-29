import { ApiProperty } from '@nestjs/swagger';

export class TuitionDto {
  @ApiProperty()
  tuitionName: string;
  @ApiProperty()
  tuitionID: string;
  @ApiProperty()
  tuitionFee: number;
  @ApiProperty()
  tuitionTeacher: string;
  @ApiProperty()
  grade: string;
}
