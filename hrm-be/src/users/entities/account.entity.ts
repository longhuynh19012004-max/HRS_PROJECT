import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { Employee } from './employee.entity';
import { UserRole } from '../../auth/enums/role.enum';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  password!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToOne(() => Employee, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}