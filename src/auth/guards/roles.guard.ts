import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.getCurrentUser(request);

    // If user is not authenticated, throw unauthorized exception.
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    // Check if user has no roles assigned, assign default role 'guest'
    const userRoles =
      user.data.roles.length === 0 ? ["GUEST"] : user.data.roles.map((role: any) => role);
    // Check if the user has at least one of the required roles
    const hasRole = () => userRoles.some((role: string) => roles.includes(role));

    if (!hasRole()) {
      throw new ForbiddenException(`Access denied. Required roles: ${roles.join(", ")}`);
    }

    return true; // Allow access if the user has at least one of the required roles
  }
}
