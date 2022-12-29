import { Tuition } from '../tuition/tutition.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentName: string;

  @Column({ unique: true })
  studentID: string;

  @Column()
  grade: number;

  @Column({ unique: true })
  mobileNumber: string;

  @Column()
  schoolName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Tuition)
  @JoinTable()
  tuitions: Tuition[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
