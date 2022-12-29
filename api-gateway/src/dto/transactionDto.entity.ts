import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
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
  cardNumber: string;
}
