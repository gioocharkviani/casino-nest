import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/db/prisma.service';
import { NotifiGatewey } from '../gatewey/notifi.gatewey';

@Injectable()
export class NotificationTasks {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly notifiGatewey: NotifiGatewey
    ) {}

    // CRON Service to check every minute for auto-triggered notifications
    @Cron(CronExpression.EVERY_11_HOURS)
    async triggerNotifications() {
        const now = new Date();
        // Debug log
        console.log('Cron job running at:', now);

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
            // Debug log
            console.log('Triggering notification:', notification.id);
            this.notifiGatewey.sendNotification(notification.recipientId, notification);

            await this.prismaService.notification.update({
                where: { id: notification.id },
                data: { trigerAt: null },
            });
        }
    }
}
