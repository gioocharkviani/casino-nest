import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { PrismaModule } from "src/db/prisma.module";
import { ScheduleModule } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";
import { NotificationTasks } from "./tasks/notification.task";
import { NotifiGateway } from "./notifi.gateway";

@Module({
  imports: [PrismaModule],
  providers: [UserService, NotificationService, NotificationTasks, NotifiGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
