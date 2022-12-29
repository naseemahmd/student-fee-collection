import { ApiProperty } from '@nestjs/swagger';

export class Receipt {
  @ApiProperty()
  reciptID: string;
  @ApiProperty()
  studentID: string;
  @ApiProperty()
  tuitionID: number;
  @ApiProperty()
  transactionID: string;
}
