import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 'uuid-1234' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: '2026-07-06' })
  @IsNotEmpty()
  @IsString()
  date!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  slotIndex!: number;

  @ApiProperty({ example: 'Team Meeting' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Discuss new features' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({ example: 'Meeting' })
  @IsNotEmpty()
  @IsString()
  type!: string;

  @ApiProperty({ example: 'Maya Chen' })
  @IsNotEmpty()
  @IsString()
  assigneeName!: string;
}
