import { Body, Controller, Get, Param, Post, Patch, Delete, Req } from "@nestjs/common";
import { Request } from "express";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/createnotifi.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //GET ALL NOTIFICATION FOR USER
  @Get()
  @Roles(Role.GUEST, Role.ADMIN, Role.SUPER_ADMIN)
  async getAllNotification(@Req() req: Request) {
    return this.notificationService.getAllNotification(req);
  }
  //GET ALL NOTIFICATION FOR USER

  //GET ALL NOTIFICATION FOR ADMIN
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT)
  @Get("admin")
  async getAllNotificationRoled(@Req() req: Request) {
    return this.notificationService.getAllNotificationRoled(req);
  }
  //GET ALL NOTIFICATION FOR ADMIN

  // EDIT NOTIFICATION BY ACCESS ROLED USERS
  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT)
  async editNotification(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: CreateNotificationDto,
  ) {
    return this.notificationService.editNotification(id, req, data);
  }
  // EDIT NOTIFICATION BY ACCESS ROLED USERS

  //GET CURRENT NOTIFICATION BY ID
  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT, Role.GUEST)
  async getById(@Param("id") id: string, @Req() req: Request) {
    return this.notificationService.getById(id, req);
  }
  //GET CURRENT NOTIFICATION BY ID

  // CREATE NOTIFICATION BY ACCESS ROLED USERS
  @Post("/create")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT)
  async createNotification(@Req() req: Request, @Body() data: CreateNotificationDto) {
    return this.notificationService.createNotification(req, data);
  }
  // CREATE NOTIFICATION BY ACCESS ROLED USERS

  // REMOVE NOTIFICATION BY ACCESS ROLED USERS
  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async removeNotification(@Param("id") id: string) {
    return this.notificationService.removeNotification(id);
  }
  // REMOVE NOTIFICATION BY ACCESS ROLED USERS

  //MARK AS READ
  @Roles(Role.ADMIN, Role.GUEST, Role.SUPER_ADMIN, Role.SUPPORT)
  @Patch(":id/read")
  async markAsRead(@Param("id") id: string) {
    return this.notificationService.markAsRead(id);
  }
  //MARK AS READ
}
