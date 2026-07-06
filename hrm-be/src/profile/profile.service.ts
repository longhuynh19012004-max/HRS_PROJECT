import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../users/entities/account.entity';
import { Employee } from '../users/entities/employee.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) { }

  async getMyProfile(userId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    return {
      id: account.id,
      email: account.email,
      role: account.role,
      employee: account.employee
        ? {
          id: account.employee.id,
          firstName: account.employee.firstName,
          lastName: account.employee.lastName,
          phone: account.employee.phone,
          department: account.employee.department,
          position: account.employee.position,
          location: account.employee.location,
          startDate: account.employee.startDate,
          status: account.employee.status,
        }
        : null,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      throw new NotFoundException('Employee profile not found!');
    }

    await this.employeeRepository.update(account.employee.id, dto);
    return { message: 'Profile updated successfully!' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, account.password);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.accountRepository.update(userId, { password: hashedNewPassword });
    return { message: 'Password changed successfully!' };
  }
}
