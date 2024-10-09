import { Module } from "@nestjs/common";
import { NotifiGateway } from "./notifi.gatewey";
import { UserService } from "src/user/user.service";
import { NotificationService } from "../notification.service";
import { NotificationModule } from "../notification.module";

@Module({
  imports: [],
  providers: [NotifiGateway, UserService],
  exports: [NotifiGateway],
})
export class NotifiModule {}
