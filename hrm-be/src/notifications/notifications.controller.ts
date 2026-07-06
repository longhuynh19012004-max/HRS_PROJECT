import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread')
  async getUnread(@Request() req: any) {
    const accountId = req.user.userId;
    return this.notificationsService.getUnread(accountId);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    const accountId = req.user.userId;
    return this.notificationsService.markAllAsRead(accountId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const accountId = req.user.userId;
    return this.notificationsService.markAsRead(id, accountId);
  }
}
