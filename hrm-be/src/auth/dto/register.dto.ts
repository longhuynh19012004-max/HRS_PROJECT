import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nhanvien@gmail.com', description: 'Tài khoản Email' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu phải từ 6 ký tự trở lên' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  password!: string;
}