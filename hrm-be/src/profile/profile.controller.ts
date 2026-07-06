import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Profile (User Self-Service)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('me')
  @ApiOperation({ summary: 'Get my profile information' })
  getMyProfile(@Request() req: any) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile information' })
  updateMyProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateMyProfile(req.user.userId, dto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change my password' })
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.profileService.changePassword(req.user.userId, dto);
  }
}
