import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";

@Controller("upload")
export class UploadController {
  //FILE UPLOAD
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg|)$/)) {
          return callback(new BadRequestException("Only image files are allowed!"), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException("Invalid file upload");
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const filePath = `/uploads/${file.filename}`;
    const fullImageUrl = `${baseUrl}${filePath}`;

    return {
      message: "File uploaded successfully!",
      imageUrl: fullImageUrl,
    };
  }
  //FILE UPLOAD
}
