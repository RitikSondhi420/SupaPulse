import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './models/notification.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Notification)
@UseGuards(GqlAuthGuard)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification], { description: 'Get notifications for current user' })
  async notifications(@CurrentUser() user: any): Promise<Notification[]> {
    return this.notificationsService.getUserNotifications(user.id, user.role);
  }

  @Mutation(() => Notification, { description: 'Mark a notification as read' })
  async markNotificationAsRead(@Args('id', { type: () => ID }) id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => Boolean, { description: 'Mark all notifications as read' })
  async markAllNotificationsAsRead(@CurrentUser() user: any): Promise<boolean> {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
