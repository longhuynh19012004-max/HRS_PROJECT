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
  ) { }

  async login(loginDto: LoginDto) {
    const account = await this.usersService.findAccountByEmail(loginDto.email);

    if (!account || !account.password) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { sub: account.id, email: account.email, role: account.role };

    return {
      message: 'Login successful!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = await this.usersService.registerFreeAccount(email, hashedPassword, fullName);

    return {
      message: 'Registration successful!',
      userId: newAccount.id,
      email: newAccount.email,
    };
  }
}