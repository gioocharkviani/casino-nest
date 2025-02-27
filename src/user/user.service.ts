import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class UserService {
  // GET CURRENT USER
  async getCurrentUser({ req, userToken }: { req?: Request; userToken?: string }) {
    const token = userToken ? userToken : req.headers.authorization;
    console.log(token);

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    // Prepare headers
    const headers = {
      Authorization: `${token}`,
      Accept: "application/json",
    };

    try {
      // Make the API request using fetch
      const response = await fetch("http://62.169.17.152:8010/api/user", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
}
