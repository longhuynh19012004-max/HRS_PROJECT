import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from '../users/dto/create-employee.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @ApiOperation({ summary: 'Log in to system to get Token' })
  @HttpCode(HttpStatus.OK) 
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}