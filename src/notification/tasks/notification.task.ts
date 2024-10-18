import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/db/prisma.service";
import { NotifiGateway } from "../notifi.gateway";

@Injectable()
export class NotificationTasks {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notifiGatewey: NotifiGateway,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async triggerNotifications() {
    const now = new Date();
    // Debug log
    console.log("Cron job running at:", now);

    const notificationsToTrigger = await this.prismaService.notification.findMany({
      where: {
        trigerAt: {
          not: null,
          lte: now,
        },
        readAt: null,
      },
    });

    for (const notification of notificationsToTrigger) {
      // Debug log for each notification being triggered
      console.log("Triggering notification:", notification.id);

      // Send the notification via the gateway
      this.notifiGatewey.sendNotification(notification.recipientId, notification);

      // Update the notification to remove trigerAt so it won't be triggered again
      await this.prismaService.notification.update({
        where: { id: notification.id },
        data: { trigerAt: null },
      });
    }
  }
}
