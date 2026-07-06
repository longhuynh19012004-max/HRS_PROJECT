import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './entities/employee.entity';
import { Account } from './entities/account.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UserRole } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) { }

  async createNewEmployeeWithAccount(dto: CreateEmployeeDto) {
    const { email, ...employeeData } = dto;
    const existingAccount = await this.accountRepository.findOne({ where: { email }, withDeleted: true });
    if (existingAccount) {
      throw new BadRequestException('Email already exists in the system!');
    }
    const employee = this.employeeRepository.create(employeeData);
    const savedEmployee = await this.employeeRepository.save(employee);

    const hashedPassword = await bcrypt.hash('123456', 10);
    const account = this.accountRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.USER,
      employee: savedEmployee,
    });
    return await this.accountRepository.save(account);
  }

  async findAccountById(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: { employee: true },
    });
    if (!account) throw new NotFoundException('Account not found!');
    return account;
  }

  async findAccountByEmail(email: string) {
    const account = await this.accountRepository.findOne({
      where: { email },
      relations: { employee: true },
    });

    return account;
  }


  async findAllAccounts(includeDeleted: boolean = false) {
    return await this.accountRepository.find({
      relations: { employee: true },
      withDeleted: includeDeleted,
    });
  }

  async updateEmployee(accountId: string, updateDto: any) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });
    if (!account || !account.employee) {
      throw new NotFoundException('Employee account not found!');
    }
    await this.employeeRepository.update(account.employee.id, updateDto);
    return { message: 'Employee information updated successfully!' };
  }

  async removeAccount(accountId: string) {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Account not found!');
    }
    await this.accountRepository.softDelete(accountId);
    return { message: 'Employee account successfully deactivated!' };
  }

  async permanentRemoveAccount(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      withDeleted: true,
      relations: { employee: true }
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    await this.accountRepository.delete(accountId);

    if (account.employee) {
      await this.employeeRepository.delete(account.employee.id);
    }

    return { message: 'Employee account permanently deleted successfully!' };
  }

  async restoreAccount(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      withDeleted: true
    });

    if (!account) {
      throw new NotFoundException('Account not found for restoration!');
    }

    await this.accountRepository.restore(accountId);
    return { message: 'Employee account successfully restored!' };
  }

  async registerFreeAccount(email: string, passwordHash: string, fullName?: string) {
    const existingAccount = await this.accountRepository.findOne({ where: { email }, withDeleted: true });
    if (existingAccount) {
      throw new BadRequestException('Email already registered in the system!');
    }

    let firstName = 'Nhân viên';
    let lastName = 'Mới';

    if (fullName && fullName.trim()) {
      const parts = fullName.trim().split(' ');
      if (parts.length === 1) {
        firstName = parts[0];
        lastName = '';
      } else {
        lastName = parts.pop() || '';
        firstName = parts.join(' ');
      }
    }

    const emptyEmployee = this.employeeRepository.create({
      firstName,
      lastName,
      status: 'active',
    });
    const savedEmployee = await this.employeeRepository.save(emptyEmployee);

    const newAccount = this.accountRepository.create({
      email,
      password: passwordHash,
      role: UserRole.USER,
      employee: savedEmployee,
    });

    return await this.accountRepository.save(newAccount);
  }
}