import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123456', description: 'Current password' })
  @IsNotEmpty({ message: 'Current password is required!' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'newpass123', description: 'New password (min 6 characters)' })
  @IsNotEmpty({ message: 'New password is required!' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters!' })
  newPassword!: string;
}
