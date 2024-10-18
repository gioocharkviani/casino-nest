import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NotificationModule } from "./notification/notification.module";
import { UserModule } from "./user/user.module";
import { RolesGuard } from "./auth/guards/roles.guard";
import { UserService } from "./user/user.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthMiddleware } from "./auth/auth.middleware";

@Module({
  imports: [NotificationModule, UserModule],
  controllers: [],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes("*");
  // }
}
