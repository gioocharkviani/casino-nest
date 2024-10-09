import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { PrismaModule } from "src/db/prisma.module";
import { NotifiModule } from "./gatewey/notifi.module";
import { ScheduleModule } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";
import { NotificationTasks } from "./tasks/notification.task";
@Module({
  imports: [PrismaModule, NotifiModule, ScheduleModule.forRoot()],
  providers: [UserService, NotificationService, NotificationTasks],
  controllers: [NotificationController],
})
export class NotificationModule {}
