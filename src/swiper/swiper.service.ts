import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateSwiperComponentDto } from "./dto/createSwiper.dto";
import { PrismaService } from "src/db/prisma.service";
import { Response } from "express";
import { join } from "path";

@Injectable()
export class SwiperService {
  constructor(private prismaService: PrismaService) {}

  // Create Swiper Component
  async createSwiperComponent(body: CreateSwiperComponentDto) {
    try {
      const createSwiper = await this.prismaService.swiper.create({
        data: body,
      });
      return createSwiper;
    } catch (error) {
      throw new BadRequestException("Failed to create swiper component");
    }
  }

  // Get all swiper links
  async getAllSwiperLinks() {
    try {
      const getData = await this.prismaService.swiper.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!getData || getData.length === 0) {
        throw new NotFoundException("No swiper links found");
      }

      return getData;
    } catch (error) {
      throw new NotFoundException("Error fetching swiper links");
    }
  }

  // Edit Swiper Component
  async editAllSwiperLinks(id: string, body: CreateSwiperComponentDto) {
    try {
      const editData = await this.prismaService.swiper.update({
        where: {
          id: parseInt(id),
        },
        data: body,
      });

      return editData;
    } catch (error) {
      throw new NotFoundException(`Swiper component with ID ${id} not found`);
    }
  }

  // Delete Swiper Component by ID
  async removeSwiperLink(id: string) {
    try {
      const removeSwiper = await this.prismaService.swiper.delete({
        where: {
          id: parseInt(id),
        },
      });

      return {
        message: `Swiper by ID ${id} successfully removed`,
      };
    } catch (error) {
      throw new NotFoundException(`Swiper component with ID ${id} not found`);
    }
  }

  //getCurrentImage
  async getSwiperImage(imageName: string, res: Response) {
    const filePath = join(process.cwd(), "uploads", imageName);
    res.sendFile(filePath);
  }
}
