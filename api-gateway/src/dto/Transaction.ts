import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty()
  id: string;
  @ApiProperty()
  transactionID: string;
  @ApiProperty()
  studentID: string;
  @ApiProperty()
  tuitionFee: number;
  @ApiProperty()
  transactionDate: string;
  @ApiProperty({ enum: ['CASH', 'CARD'] })
  paymentMehtod: string;
  @ApiProperty()
  cardType: string;
  @ApiProperty()
  cardNumber: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
