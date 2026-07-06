import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async createMany(createScheduleDtos: CreateScheduleDto[]) {
    const schedules = createScheduleDtos.map(dto => this.scheduleRepository.create(dto));
    return await this.scheduleRepository.save(schedules);
  }

  async findAll() {
    return await this.scheduleRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string) {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    await this.scheduleRepository.delete(id);
    return { message: 'Schedule removed successfully' };
  }
}
