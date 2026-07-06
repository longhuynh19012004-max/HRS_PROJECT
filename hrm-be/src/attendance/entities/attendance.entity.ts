import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ nullable: true })
  checkInTime!: string;

  @Column({ nullable: true })
  checkOutTime!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;
}
