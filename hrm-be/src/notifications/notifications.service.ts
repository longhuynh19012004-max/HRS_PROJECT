import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Account } from '../users/entities/account.entity';
import { UserRole } from '../auth/enums/role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createNotification(accountId: string, message: string, type: string) {
    const notification = this.notificationRepository.create({
      accountId,
      message,
      type,
      isRead: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async notifyAdmins(message: string, type: string) {
    const admins = await this.accountRepository.find({ where: { role: UserRole.ADMIN } });
    const notifications = admins.map(admin => 
      this.notificationRepository.create({
        accountId: admin.id,
        message,
        type,
        isRead: false,
      })
    );
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  async getUnread(accountId: string) {
    return await this.notificationRepository.find({
      where: { accountId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string, accountId: string) {
    await this.notificationRepository.update(
      { id: notificationId, accountId },
      { isRead: true }
    );
    return { success: true };
  }

  async markAllAsRead(accountId: string) {
    await this.notificationRepository.update(
      { accountId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }
}
