import { Module } from "@nestjs/common";
import { SwiperController } from "./swiper.controller";
import { SwiperService } from "./swiper.service";
import { PrismaService } from "src/db/prisma.service";

@Module({
  controllers: [SwiperController],
  providers: [SwiperService, PrismaService],
})
export class SwiperModule {}
