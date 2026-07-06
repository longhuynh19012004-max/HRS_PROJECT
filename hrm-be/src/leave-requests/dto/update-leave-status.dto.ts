import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeaveStatusDto {
  @ApiProperty({ example: 'Approved', enum: ['Approved', 'Rejected'] })
  @IsNotEmpty()
  @IsIn(['Approved', 'Rejected'])
  status!: string;
}
