import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  getToday(@Request() req: any) {
    return this.attendanceService.getToday(req.user.userId);
  }

  @Post('check-in')
  checkIn(@Request() req: any) {
    return this.attendanceService.checkIn(req.user.userId);
  }

  @Post('check-out')
  checkOut(@Request() req: any) {
    return this.attendanceService.checkOut(req.user.userId);
  }
}
