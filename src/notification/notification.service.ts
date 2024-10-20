import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateNotificationDto } from "./dto/createnotifi.dto";
import { NotifiGateway } from "./notifi.gateway";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { Role } from "src/auth/enums/roles.enum";

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notifiGatewey: NotifiGateway,
    private readonly userService: UserService,
  ) {}

  // GET ALL NOTIFICATION BY ROLED USERS
  async getAllNotificationRoled(req: Request) {
    const user = await this.userService.getCurrentUser(req);
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    // Extract query parameters for pagination, sorting, and searching
    const {
      page = 1,
      per_page = 10,
      sort_by = "createdAt",
      sort_direction = "desc",
      search = "",
    } = req.query;

    // If sort_by is empty, use 'createdAt' as the default
    const sortByField = sort_by === "" ? "createdAt" : sort_by;

    const take = parseInt(per_page as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const { ip } = req;

    const ADMIN_FRONT_IP = "*";

    const searchFilter = search
      ? {
          OR: [
            { content: { contains: search as string } },
            { recipientId: { contains: search as string } },
          ],
        }
      : {};

    const notificationData = await this.prismaService.notification.findMany({
      where: {
        ...searchFilter,
      },
      skip,
      take,
      orderBy: {
        [sortByField as string]: sort_direction === "asc" ? "asc" : "desc",
      },
    });

    const totalNotifications = await this.prismaService.notification.count({
      where: {
        ...searchFilter,
      },
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
  // GET ALL NOTIFICATION BY ROLED USERS

  // GET ALL NOTIFICATION FOR  USERS
  async getAllNotification(req: Request) {
    const user = await this.userService.getCurrentUser(req);
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }
    const userId = user.data.id.toString();
    const notificationData = await this.prismaService.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const dataObject = {
      data: notificationData,
    };
    return dataObject;
  }
  // GET ALL NOTIFICATION FOR  USERS

  // GET CURRENT NOTIFICATION
  async getById(id: string, req: Request) {
    const user = await this.userService.getCurrentUser(req);
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    const parsedId = parseInt(id);

    const notification = await this.prismaService.notification.findFirst({
      where: { id: parsedId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  // GET CURRENT NOTIFICATION

  // CREATE notification by ADMIN
  async createNotification(req: Request, data: CreateNotificationDto) {
    const { recipientIds, content, category, readAt, trigerAt, title } = data;

    if (!recipientIds || recipientIds.length === 0) {
      throw new Error("Recipient IDs are required");
    }

    const notifications = await Promise.all(
      recipientIds.map(async (recipientId) => {
        const recipientIdString = String(recipientId);
        const notification = await this.prismaService.notification.create({
          data: {
            recipientId: recipientIdString,
            title,
            content,
            category,
            readAt: readAt ? new Date(readAt) : null,
            trigerAt: trigerAt ? new Date(trigerAt) : null,
          },
        });

        if (!trigerAt || new Date(trigerAt) <= new Date()) {
          this.notifiGatewey.sendNotification(recipientId, notification);
        }

        return notification;
      }),
    );

    return notifications;
  }

  // CREATE notification by ADMIN

  // DELETE notification by user
  async removeNotification(id: string) {
    try {
      // Convert the id to an integer
      const parseIntId = parseInt(id);

      // Check if the provided id is a valid number
      if (isNaN(parseIntId)) {
        throw new Error("Invalid notification ID");
      }

      // Find the notification by id
      const findNotification = await this.prismaService.notification.findUnique({
        where: { id: parseIntId },
      });

      // If notification not found, throw an error
      if (!findNotification) {
        throw new Error(`Notification with ID ${parseIntId} not found`);
      }

      // Delete the notification
      await this.prismaService.notification.delete({
        where: { id: parseIntId },
      });
      this.notifiGatewey.handleRemoveNotification(findNotification.recipientId, findNotification);
      return { message: "Notification deleted successfully" };
    } catch (error) {
      // Handle errors and return appropriate message
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }
  // DELETE notification by user

  // EDIT NOTIFICATION
  async editNotification(id: string, req: Request, data: any) {
    const { recipientIds, trigerAt, category, content } = data;
    const user = await this.userService.getCurrentUser(req);
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    const parsedId = parseInt(id);
    const notification = await this.prismaService.notification.findFirst({
      where: { id: parsedId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const updatedNotification = await this.prismaService.notification.update({
      where: { id: parsedId },
      data: {
        recipientId: recipientIds[0],
        content: content,
        trigerAt: trigerAt,
        category: category,
      },
    });

    // Notify the user via WebSocket if required
    this.notifiGatewey.sendNotification(updatedNotification.recipientId, updatedNotification);

    return updatedNotification;
  }
  // EDIT NOTIFICATION

  // MARK AS READ
  async markAsRead(notificationId: string) {
    const notification = await this.prismaService.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    if (notification.readAt) {
      return { message: "Notification is already marked as read" };
    }

    const updatedNotification = await this.prismaService.notification.update({
      where: { id: parseInt(notificationId) },
      data: {
        readAt: new Date(),
      },
    });

    // Notify the user via WebSocket if required
    this.notifiGatewey.markAsReadNotification(updatedNotification.recipientId, updatedNotification);
    return { message: "Notification marked as read", notification: updatedNotification };
  }
  // MARK AS READ
}
