import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../users/entities/employee.entity';
import { Account } from '../users/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee, Account])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
