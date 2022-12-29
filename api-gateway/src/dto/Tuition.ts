import { ApiProperty } from '@nestjs/swagger';

export class Tuition {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tuitionName: string;
  @ApiProperty()
  tuitionID: string;
  @ApiProperty()
  tuitionFee: number;
  @ApiProperty()
  tuitionTeacher: string;
  @ApiProperty()
  grade: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
