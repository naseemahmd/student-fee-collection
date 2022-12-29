import { Tuition } from './tuitionDto';

export class Student {
  id: string;
  studentName: string;

  studentID: string;

  grade: number;

  mobileNumber: string;

  schoolName: string;

  isActive: boolean;

  tuitions: Tuition[];

  created_at: Date;

  updated_at: Date;
}
