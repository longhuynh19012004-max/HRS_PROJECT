import { 
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, 
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn 
} from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  startDate!: string;

  @Column({ type: 'varchar' })
  endDate!: string;

  @Column({ type: 'varchar' })
  type!: string; // 'Annual', 'Sick', 'Unpaid'

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'varchar', default: 'Pending' })
  status!: string; // 'Pending', 'Approved', 'Rejected'

  @ManyToOne(() => Employee, employee => employee.leaveRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
