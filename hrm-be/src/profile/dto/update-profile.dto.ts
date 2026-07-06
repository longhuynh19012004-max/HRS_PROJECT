import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Nguyễn', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Văn A', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Phòng IT', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Developer', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: 'Hà Nội', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2026-07-01', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;
}
