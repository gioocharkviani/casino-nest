import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateNotificationDto } from './dto/createnotifi.dto';
import { NotifiGatewey } from './gatewey/notifi.gatewey';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly notifiGatewey: NotifiGatewey,
        private readonly userService:UserService,
    ) {}

// GET ALL NOTIFICATION BY ROLES
async getAllNotifications(req: Request) {
    const user = await this.userService.getCurrentUser(req);
    
    if (!user) {
        throw new UnauthorizedException('Unauthorized');
    }

    const userRole = user.roles[0]?.name;
    const userId = user.id.toString();
    // Extract query parameters for pagination and sorting
    const { page = 1, per_page = 10, sort_by = 'createdAt', sort_direction = 'desc' } = req.query;
    const take = parseInt(per_page as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    
    // Check if user has not a role
    if (!userRole) {
        const notificationData = await this.prismaService.notification.findMany({
            where: { recipientId: userId },
            skip,
            take,
            orderBy: {
                [sort_by as string]: sort_direction === 'asc' ? 'asc' : 'desc',
            },
        });
        
        const totalNotifications = await this.prismaService.notification.count({
            where: { recipientId: userId },
        });
        
        const dataObject = {
            data: notificationData,
            meta: {
                page: parseInt(page as string, 10),
                per_page: take,
                total: totalNotifications,
                total_pages: Math.ceil(totalNotifications / take),
            },
        };

        return dataObject;
    }
    // Check if user has not a role

    // Check if user has ROLE
 
        const notificationData = await this.prismaService.notification.findMany({
            skip,
            take,
            orderBy: {
                [sort_by as string]: sort_direction === 'asc' ? 'asc' : 'desc',
            },
        });
        
        const totalNotifications = await this.prismaService.notification.count();
        
        const dataObject = {
            data: notificationData,
            meta: {
                page: parseInt(page as string, 10),
                per_page: take,
                total: totalNotifications,
                total_pages: Math.ceil(totalNotifications / take),
            },
        };

        return dataObject;
}
// GET ALL NOTIFICATION BY ROLES


// GET CURRENT NOTIFICATION
async getById(id: number) {
    const now = new Date();
    const notifications = await this.prismaService.notification.findMany({
        where: {
            AND: [
                { recipientId: id.toString() },
                {
                    OR: [
                        { trigerAt: null },
                        { trigerAt: { lte: now } }, // Check for trigerAt <= now
                    ],
                },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            recipientId: true,
            id: true,
            content: true,
            category: true,
            trigerAt: true,
        },
    });
    
    // Reset trigerAt if notifications are triggered
    const triggeredNotifications = notifications.filter(n => n.trigerAt && new Date(n.trigerAt) <= now);
    for (const notification of triggeredNotifications) {
        await this.prismaService.notification.update({
            where: { id: notification.id },
            data: { trigerAt: null }, // Reset the trigerAt after it is triggered
        });
    }
    
    return notifications;
}
// GET CURRENT NOTIFICATION


// CREATE notification by ADMIN
async createNotification(req:Request, data:CreateNotificationDto) {    
    const {recipientId , content , category,readAt,trigerAt} = data;
    const notification = await this.prismaService.notification.create({
        data: {
              recipientId,
              content,
              category,
              readAt,
              trigerAt,
            },
        });

        if (!trigerAt || new Date(trigerAt) <= new Date()) {
            this.notifiGatewey.sendNotification(recipientId, notification);
        }
        const dates = new Date();
        return notification ;
    }
    

    // READ notification by user
    async readNotification(id: string) {
        const updateData = await this.prismaService.notification.update({
            where: {
                id: parseInt(id),
                readAt: null, 
            },
            data: {
                readAt: new Date(),
            },
        });

        return updateData;
}
// CREATE notification by ADMIN

// DELETE notification by user
async removeNotification(id: string) {
    const removeFromDb = await this.prismaService.notification.delete({
        where: {
            id: parseInt(id),
        },
    });
    return removeFromDb;
}
}
// DELETE notification by user
