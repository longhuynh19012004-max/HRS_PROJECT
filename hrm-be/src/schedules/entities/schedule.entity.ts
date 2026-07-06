import { 
  Entity, Column, PrimaryColumn, CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('varchar')
  id!: string;

  @Column({ type: 'varchar' })
  date!: string;

  @Column({ type: 'int' })
  slotIndex!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  detail!: string;

  @Column({ type: 'varchar' })
  type!: string; // 'Meeting', 'Check-in', 'Interview', 'Reminder'

  @Column({ type: 'varchar' })
  assigneeName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
