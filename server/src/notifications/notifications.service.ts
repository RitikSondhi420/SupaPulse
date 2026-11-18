import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from './models/notification.model';

export const INITIAL_NOTIFICATIONS_DATA: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_admin',
    teamId: 'team_eng',
    senderName: 'Marcus Brody',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Task Rejected by QA',
    message: 'ENG-105: Fix race condition during workspace invite acceptance was rejected and marked Failed.',
    taskId: 'task_5',
    type: 'testing_failed',
    read: false,
    createdAt: new Date('2026-11-17T11:45:00Z'),
  },
  {
    id: 'notif_2',
    userId: 'usr_admin',
    teamId: 'team_platform',
    senderName: 'David Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Ready for Review',
    message: 'DB-401: PostgreSQL Row Level Security (RLS) policies deployed to Staging for audit.',
    taskId: 'task_9',
    type: 'review_required',
    read: false,
    createdAt: new Date('2026-11-17T08:45:00Z'),
  },
  {
    id: 'notif_3',
    userId: 'usr_admin',
    teamId: 'team_eng',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Task Completed',
    message: 'ENG-104: Redis JWT Revocation Blocklist Cache passed all performance benchmarks.',
    taskId: 'task_4',
    type: 'completed',
    read: true,
    createdAt: new Date('2026-11-15T16:00:00Z'),
  },
];

@Injectable()
export class NotificationsService {
  private inMemoryNotifications: Notification[] = [...INITIAL_NOTIFICATIONS_DATA];

  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string, userRole: string): Promise<Notification[]> {
    if (this.prisma.isConnected) {
      const notifs = await this.prisma.notification.findMany({
        where: userRole === 'Admin' ? {} : { userId },
        include: { sender: true },
        orderBy: { createdAt: 'desc' },
      });
      return notifs.map((n) => ({
        id: n.id,
        userId: n.userId,
        teamId: n.teamId,
        senderName: n.sender?.name || 'User',
        senderAvatar: n.sender?.avatar,
        title: n.title,
        message: n.message,
        taskId: n.taskId,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
      }));
    }

    if (userRole === 'Admin') {
      return this.inMemoryNotifications;
    }
    return this.inMemoryNotifications.filter((n) => n.userId === userId);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notif = this.inMemoryNotifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
    }
    return notif;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    this.inMemoryNotifications.forEach((n) => {
      if (n.userId === userId || userId === 'usr_admin') {
        n.read = true;
      }
    });
    return true;
  }
}
