import { ApiProperty } from '@nestjs/swagger';

export class AssignTuition {
  @ApiProperty()
  tuitionID: string;
}

export class GetFee {
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  studentID: string;
  @ApiProperty()
  tuitionList: string[];
  @ApiProperty()
  totalFee: number;
}
