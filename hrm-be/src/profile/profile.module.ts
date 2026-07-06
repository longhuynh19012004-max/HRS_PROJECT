import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Account } from '../users/entities/account.entity';
import { Employee } from '../users/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Employee])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
