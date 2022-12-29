import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  grade: number;
  @ApiProperty()
  schoolName: string;
}
export class Purchase {
  @ApiProperty()
  tuitionName: string;
  @ApiProperty()
  tuitionFee: number;
  @ApiProperty()
  grade: number;
}
export class TransactionDto {
  @ApiProperty()
  dateTime: string;
  @ApiProperty()
  studentName: string;
  @ApiProperty()
  studentID: string;
  @ApiProperty()
  refferance: string;
  @ApiProperty()
  card: number;
  @ApiProperty()
  cardType: string;
}

export class ReceiptDTO {
  @ApiProperty({ type: () => StudentDto })
  student: StudentDto;
  @ApiProperty({ type: () => [Purchase] })
  purchase: Purchase[];
  @ApiProperty({ type: () => TransactionDto })
  transaction: TransactionDto;
  @ApiProperty()
  emailNote: string;
}
