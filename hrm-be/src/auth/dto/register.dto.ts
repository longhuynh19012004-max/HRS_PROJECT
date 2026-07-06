import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nhanvien@gmail.com', description: 'Email Account' })
  @IsEmail({}, { message: 'Invalid email format!' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  password!: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}