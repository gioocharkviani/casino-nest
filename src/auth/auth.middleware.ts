import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException("Token not provided");
      }

      const user = await this.userService.getCurrentUser({ req });
      if (!user) {
        throw new UnauthorizedException("Invalid token or unauthorized user");
      }

      req["user"] = user;

      next();
    } catch (error) {
      throw new UnauthorizedException("Unauthorized access");
    }
  }
}
