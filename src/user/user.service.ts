import { Injectable, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class UserService {
  // GET CURRENT USER
  async getCurrentUser({ req, userToken }: { req?: Request; userToken?: string }) {
    const token = userToken ? userToken : req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }
    const headers = {
      Authorization: `${token}`,
      Accept: "application/json",
    };

    try {
      const response = await fetch("http://62.169.17.152:8010/api/user", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UnauthorizedException("Invalid token or unauthorized access");
        }

        throw new InternalServerErrorException("Error fetching user");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching user: ${error.message}`);
    }
  }
}
