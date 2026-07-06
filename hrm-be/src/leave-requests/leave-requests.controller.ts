import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Leave Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new leave request' })
  create(@Request() req: any, @Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leaveRequestsService.create(req.user.userId, createLeaveRequestDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all leave requests for the logged-in user' })
  findAllForUser(@Request() req: any) {
    return this.leaveRequestsService.findAllForUser(req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all leave requests across the company (Admin only)' })
  findAll() {
    return this.leaveRequestsService.findAll();
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve or Reject a leave request (Admin only)' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateLeaveStatusDto) {
    return this.leaveRequestsService.updateStatus(id, updateDto.status);
  }
}
