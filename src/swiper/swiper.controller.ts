import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, Response } from "@nestjs/common";
import { SwiperService } from "./swiper.service";
import { CreateSwiperComponentDto } from "./dto/createSwiper.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";

@Controller("swiper")
export class SwiperController {
  constructor(readonly swiperService: SwiperService) {}

  // CREATE MAIN SWIPER COMPONENT IN DB
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post("create")
  async createSwiperComponent(@Body() body: CreateSwiperComponentDto) {
    return this.swiperService.createSwiperComponent(body);
  }
  // CREATE MAIN SWIPER COMPONENT IN DB

  //GET ALL SWIPER COMPONENTS
  @Get("getAll")
  async getAllSwiperLinks() {
    return this.swiperService.getAllSwiperLinks();
  }
  //GET ALL SWIPER COMPONENTS

  @Get(":imageName")
  async getSwiperImage(@Param("imageName") imageName: string, @Response() res) {
    return this.swiperService.getSwiperImage(imageName, res);
  }

  //GET ALL SWIPER COMPONENTS
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch("update/:id")
  async editAllSwiperLinks(@Param("id") id: string, @Body() body: CreateSwiperComponentDto) {
    return this.swiperService.editAllSwiperLinks(id, body);
  }
  //GET ALL SWIPER COMPONENTS

  //DELETE SWIPER BY ID
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete("delete/:id")
  async removeSwiperLink(@Param("id") id: string) {
    return this.swiperService.removeSwiperLink(id);
  }
  //DELETE SWIPER BY ID
}
