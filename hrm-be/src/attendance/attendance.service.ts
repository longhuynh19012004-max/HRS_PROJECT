import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Account } from '../users/entities/account.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }

  async getToday(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      return null;
    }

    const today = this.getTodayString();
    return await this.attendanceRepository.findOne({
      where: { employee: { id: account.employee.id }, date: today },
    });
  }

  async checkIn(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = this.getTodayString();
    let record = await this.attendanceRepository.findOne({
      where: { employee: { id: account.employee.id }, date: today },
    });

    if (!record) {
      record = this.attendanceRepository.create({
        employee: account.employee,
        date: today,
        checkInTime: this.getCurrentTime(),
      });
      return await this.attendanceRepository.save(record);
    }
    return record; // Already checked in
  }

  async checkOut(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = this.getTodayString();
    const record = await this.attendanceRepository.findOne({
      where: { employee: { id: account.employee.id }, date: today },
    });

    if (record && !record.checkOutTime) {
      record.checkOutTime = this.getCurrentTime();
      return await this.attendanceRepository.save(record);
    }
    return record; // Already checked out or didn't check in
  }
}
