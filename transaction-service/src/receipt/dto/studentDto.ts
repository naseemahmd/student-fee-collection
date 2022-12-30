import { TuitionDto } from './tuitionDto';

export class Student {
  id: string;
  studentName: string;

  studentID: string;

  grade: number;

  mobileNumber: string;

  schoolName: string;

  isActive: boolean;

  tuitions: TuitionDto[];

  created_at: Date;

  updated_at: Date;
}
