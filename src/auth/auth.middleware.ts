import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the authorization token from the request header
      const token = req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException("Token not provided");
      }

      // Fetch the current user using the token
      const user = await this.userService.getCurrentUser(req);
      if (!user) {
        throw new UnauthorizedException("Invalid token or unauthorized user");
      }

      // Attach the user object to the request for further use in the controllers
      req["user"] = user;

      // Call the next middleware or controller
      next();
    } catch (error) {
      // Return unauthorized error if user is not authenticated
      throw new UnauthorizedException("Unauthorized access");
    }
  }
}
