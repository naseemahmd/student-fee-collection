import { TransactionDto } from './TransactionDto';

export class StudentDto {
  studentName: string;

  grade: number;

  schoolName: string;
}
export class Purchase {
  tuitionName: string;

  tuitionFee: number;

  grade: number;
}

export class ReceiptDTO {
  student: StudentDto;
  purchase: Purchase[];
  transaction: TransactionDto;
  emailNote: string;
}
