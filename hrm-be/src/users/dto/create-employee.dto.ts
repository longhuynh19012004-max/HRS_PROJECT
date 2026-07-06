import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Nguyễn' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Văn A' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Phòng IT' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Developer' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '15000000' })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}