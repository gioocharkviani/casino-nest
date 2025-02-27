import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { PrismaModule } from "src/db/prisma.module";
import { ScheduleModule } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";
import { NotificationTasks } from "./tasks/notification.task";
import { NotifiGateway } from "./notifi.gateway";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot(), UserModule],
  providers: [UserService, NotificationService, NotificationTasks, NotifiGateway, UserService],
  controllers: [NotificationController],
})
export class NotificationModule {}
