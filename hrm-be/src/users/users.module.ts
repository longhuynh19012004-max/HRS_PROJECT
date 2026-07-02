import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Account } from './entities/account.entity';

@Module({
  // 👇 Khai báo cả 2 Entity mới vào đây
  imports: [TypeOrmModule.forFeature([Employee, Account])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Xuất ra để AuthModule có thể dùng ké UsersService
})
export class UsersModule {}