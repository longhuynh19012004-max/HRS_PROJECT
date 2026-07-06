import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Both users and admins need to read schedules
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create multiple schedule entries' })
  @ApiBody({ type: [CreateScheduleDto] })
  createMany(@Body() createScheduleDtos: CreateScheduleDto[]) {
    return this.schedulesService.createMany(createScheduleDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules' })
  findAll() {
    return this.schedulesService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule entry' })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
