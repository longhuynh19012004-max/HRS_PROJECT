import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { Account } from '../users/entities/account.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createDto: CreateLeaveRequestDto) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      throw new NotFoundException('Employee record not found for this account');
    }

    const leaveRequest = this.leaveRequestRepository.create({
      ...createDto,
      employee: account.employee,
      status: 'Pending',
    });

    const savedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);

    await this.notificationsService.notifyAdmins(
      `New leave request from ${account.employee.firstName} ${account.employee.lastName}`,
      'leave_request_created'
    );

    return savedLeaveRequest;
  }

  async findAllForUser(userId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!account || !account.employee) {
      return [];
    }

    return await this.leaveRequestRepository.find({
      where: { employee: { id: account.employee.id } },
      order: { createdAt: 'DESC' },
      relations: { employee: true },
    });
  }

  async findAll() {
    return await this.leaveRequestRepository.find({
      order: { createdAt: 'DESC' },
      relations: { employee: true },
    });
  }

  async updateStatus(id: string, status: string) {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    leaveRequest.status = status;
    const saved = await this.leaveRequestRepository.save(leaveRequest);

    if (leaveRequest.employee) {
      const account = await this.accountRepository.findOne({ where: { employee: { id: leaveRequest.employee.id } } });
      if (account) {
        await this.notificationsService.createNotification(
          account.id,
          `Your leave request has been ${status.toLowerCase()}`,
          'leave_request_status'
        );
      }
    }

    return saved;
  }
}
