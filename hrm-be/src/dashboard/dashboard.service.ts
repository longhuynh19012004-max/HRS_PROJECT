import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../users/entities/employee.entity';
import { LeaveRequest } from '../leave-requests/entities/leave-request.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>
  ) {}

  async getOverview() {
    const totalEmployees = await this.employeeRepository.count();
    const pendingRequests = await this.leaveRequestRepository.count({
      where: { status: 'Pending' },
    });

    const today = new Date().toISOString().split('T')[0];
    const checkedInToday = await this.attendanceRepository.count({
      where: { date: today },
    });

    const notArrivedToday = Math.max(0, totalEmployees - checkedInToday);

    return {
      metrics: [
        { label: "Total Employees", value: totalEmployees.toString(), trend: "", icon: "people" },
        { label: "Requests Pending", value: pendingRequests.toString(), trend: "", icon: "time" },
        { label: "Not Arrived Today", value: notArrivedToday.toString(), trend: "", icon: "people" },
        { label: "Monthly Payroll", value: "$0", trend: "", icon: "payroll" },
      ],
      departments: [],
      employees: [],
      activities: [],
    };
  }
}
