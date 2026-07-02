import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Quản lý Nhân sự (Chỉ ADMIN)')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(UserRole.ADMIN) // 🔒 KHÓA TỔNG: Chỉ Admin mới được quyền xài tất cả API trong này
@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Admin tạo hồ sơ nhân viên mới' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.createNewEmployeeWithAccount(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhân viên' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Truyền true nếu muốn xem cả những nhân viên đã bị xóa' })
  findAll(@Query('includeDeleted') includeDeleted?: string) {
    // Vì query param nhận vào là string, ta cần convert sang boolean
    const isInclude = includeDeleted === 'true';
    return this.usersService.findAllAccounts(isInclude);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin cập nhật thông tin nhân sự' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.usersService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin xóa (khóa) tài khoản nhân sự' })
  remove(@Param('id') id: string) {
    return this.usersService.removeAccount(id);
  }

  @Patch(':id/restore') // 👈 API khôi phục tài khoản
  @ApiOperation({ summary: 'Admin khôi phục tài khoản nhân sự đã xóa' })
  restore(@Param('id') id: string) {
    return this.usersService.restoreAccount(id);
  }
}