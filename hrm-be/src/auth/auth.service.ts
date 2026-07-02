import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateEmployeeDto } from '../users/dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // 🔑 ĐĂNG NHẬP
  async login(loginDto: LoginDto) {
    // 1. Tìm tài khoản bằng email
    const account = await this.usersService.findAccountByEmail(loginDto.email);
    
    // 2. Chặn nếu không có tài khoản hoặc chưa thiết lập mật khẩu (Account mới tạo)
    if (!account || !account.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // 3. Kiểm tra mật khẩu mã hóa
    const isPasswordValid = await bcrypt.compare(loginDto.password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // 4. Cấp Token chứa quyền hạn (role)
    const payload = { sub: account.id, email: account.email, role: account.role };
    
    return {
      message: 'Đăng nhập thành công!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // 📝 ĐĂNG KÝ (Admin tạo nhân viên)
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // 1. Tiến hành băm nhỏ mật khẩu để bảo mật
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Gọi hàm lưu trữ trực tiếp của UsersService
    const newAccount = await this.usersService.registerFreeAccount(email, hashedPassword);

    return {
      message: 'Đăng ký tài khoản thành công!',
      userId: newAccount.id,
      email: newAccount.email,
    };
  }
}