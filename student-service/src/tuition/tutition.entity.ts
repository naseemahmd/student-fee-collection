import { Student } from 'src/student/student.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Tuition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tuitionName: string;

  @Column({ unique: true })
  tuitionID: string;

  @Column()
  tuitionFee: number;

  @Column({ unique: true })
  tuitionTeacher: string;

  @Column()
  grade: number;

  @Column({ default: true })
  isActive: boolean;

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
