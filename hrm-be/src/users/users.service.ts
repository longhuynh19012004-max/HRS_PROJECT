import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Account } from './entities/account.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UserRole } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  // ➕ C - Create: Admin tạo nhân viên mới
  async createNewEmployeeWithAccount(dto: CreateEmployeeDto) {
    const { email, ...employeeData } = dto;
    const existingAccount = await this.accountRepository.findOne({ where: { email }, withDeleted: true }); // Check cả những người đã bị xóa
    if (existingAccount) {
      throw new BadRequestException('Email này đã tồn tại trên hệ thống!');
    }
    const employee = this.employeeRepository.create(employeeData);
    const savedEmployee = await this.employeeRepository.save(employee);

    const account = this.accountRepository.create({
      email,
      role: UserRole.USER,
      employee: savedEmployee,
    });
    return await this.accountRepository.save(account);
  }

  // 🔍 R - Read (Chi tiết): Tìm tài khoản bằng email (cho Login)
  async findAccountByEmail(email: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { email },
      relations: { employee: true },
    });
  }

  // 📋 R - Read (Danh sách): Lấy danh sách tài khoản
  // Thêm tham số includeDeleted để Admin có thể lọc xem ai đã bị xóa
  async findAllAccounts(includeDeleted: boolean = false) {
    return await this.accountRepository.find({
      relations: { employee: true },
      withDeleted: includeDeleted, // 👈 Nếu truyền true, TypeORM sẽ lôi cả những ông có deletedAt ra
    });
  }

  // 📝 U - Update: Admin sửa thông tin
  async updateEmployee(accountId: string, updateDto: any) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });
    if (!account || !account.employee) {
      throw new NotFoundException('Không tìm thấy tài khoản nhân viên này!');
    }
    await this.employeeRepository.update(account.employee.id, updateDto);
    return { message: 'Cập nhật thông tin nhân viên thành công!' };
  }

  // 🗑️ D - Delete (Xóa mềm): Khóa tài khoản nhân viên
  async removeAccount(accountId: string) {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản!');
    }
    await this.accountRepository.softDelete(accountId); // 👈 Điền timestamp vào cột deletedAt
    return { message: 'Đã xóa (khóa) tài khoản nhân sự thành công!' };
  }

  // 🔄 RESTORE: Khôi phục tài khoản đã xóa mềm
  async restoreAccount(accountId: string) {
    // Phải thêm { withDeleted: true } thì TypeORM mới chịu tìm trong đống dữ liệu đã xóa
    const account = await this.accountRepository.findOne({ 
      where: { id: accountId }, 
      withDeleted: true 
    });

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản này để khôi phục!');
    }

    await this.accountRepository.restore(accountId); // 👈 Xóa timestamp trong cột deletedAt (đưa về null)
    return { message: 'Khôi phục tài khoản nhân sự thành công!' };
  }

  async registerFreeAccount(email: string, passwordHash: string) {
    // 1. Kiểm tra xem email đã tồn tại chưa
    const existingAccount = await this.accountRepository.findOne({ where: { email }, withDeleted: true });
    if (existingAccount) {
      throw new BadRequestException('Email này đã được đăng ký trên hệ thống!');
    }

    // 2. Tạo một hồ sơ nhân viên rỗng (Placeholder) để liên kết
    const emptyEmployee = this.employeeRepository.create({
      firstName: 'Nhân viên',
      lastName: 'Mới',
      status: 'active',
      // Các trường khác tự động là null hoặc default
    });
    const savedEmployee = await this.employeeRepository.save(emptyEmployee);

    // 3. Tạo tài khoản chính thức chứa mật khẩu
    const newAccount = this.accountRepository.create({
      email,
      password: passwordHash, // Lưu mật khẩu đã mã hóa băm nhỏ
      role: UserRole.USER,    // Đăng ký tự do mặc định là quyền USER
      employee: savedEmployee,
    });

    return await this.accountRepository.save(newAccount);
  }
}