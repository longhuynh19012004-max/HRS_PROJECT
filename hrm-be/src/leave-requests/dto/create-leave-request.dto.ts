import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveRequestDto {
  @ApiProperty({ example: '2026-07-06' })
  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @ApiProperty({ example: '2026-07-08' })
  @IsNotEmpty()
  @IsString()
  endDate!: string;

  @ApiProperty({ example: 'Annual', enum: ['Annual', 'Sick', 'Unpaid'] })
  @IsNotEmpty()
  @IsIn(['Annual', 'Sick', 'Unpaid'])
  type!: string;

  @ApiProperty({ example: 'Family vacation' })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
