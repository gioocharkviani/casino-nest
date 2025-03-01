import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { NotificationModule } from "./notification/notification.module";
import { UserModule } from "./user/user.module";
import { RolesGuard } from "./auth/guards/roles.guard";
import { UserService } from "./user/user.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthMiddleware } from "./auth/auth.middleware";
import { UploadModule } from "./upload/upload.module";
import { SwiperModule } from "./swiper/swiper.module";

@Module({
  imports: [NotificationModule, UserModule, UploadModule, SwiperModule],
  controllers: [],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "api/swiper/create", method: RequestMethod.POST },
        { path: "api/swiper/update/:id", method: RequestMethod.PATCH },
        { path: "api/swiper/delete/:id", method: RequestMethod.DELETE },
        { path: "api/user/*", method: RequestMethod.ALL },
        { path: "api/upload/*", method: RequestMethod.ALL },
        { path: "api/notification/*", method: RequestMethod.ALL },
      );
  }
}
