import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionID: string;

  studentID: string;

  @Column()
  tuitionFee: number;

  @Column()
  transactionDate: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMehtod: PaymentMethod;

  @Column({ nullable: true })
  cardType: string;

  @Column({ nullable: true })
  cardNumber: string;

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
