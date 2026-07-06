import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../users/entities/employee.entity';
import { LeaveRequest } from '../leave-requests/entities/leave-request.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, LeaveRequest, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
