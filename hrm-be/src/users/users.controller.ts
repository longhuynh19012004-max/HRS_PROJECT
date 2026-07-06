import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Personnel Management (ADMIN Only)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Admin creates a new employee profile' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.createNewEmployeeWithAccount(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get employee list' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Pass true to include deleted employees' })
  findAll(@Query('includeDeleted') includeDeleted?: string) {
    const isInclude = includeDeleted === 'true';
    return this.usersService.findAllAccounts(isInclude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of 1 employee account' })
  findOne(@Param('id') id: string) {
    return this.usersService.findAccountById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin updates personnel information' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.usersService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin deletes (deactivates) personnel account' })
  remove(@Param('id') id: string) {
    return this.usersService.removeAccount(id);
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Admin permanently deletes personnel account' })
  permanentRemove(@Param('id') id: string) {
    return this.usersService.permanentRemoveAccount(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin restores deleted personnel account' })
  restore(@Param('id') id: string) {
    return this.usersService.restoreAccount(id);
  }
}