import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  department!: string; 

  @Column({ type: 'varchar', nullable: true })
  position!: string; 

  @Column({ type: 'varchar', nullable: true })
  startDate!: string; 

  @Column({ type: 'varchar', nullable: true })
  location!: string; 

  @Column({ type: 'varchar', nullable: true })
  salary!: string; 

  @Column({ type: 'varchar', default: 'active' })
  status!: string; 
}