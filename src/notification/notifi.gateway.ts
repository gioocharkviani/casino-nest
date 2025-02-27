import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";

@WebSocketGateway({
  namespace: "notification",
  cors: {
    origin: "*",
  },
})
export class NotifiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>(); // User ID -> Socket
  private socketToUser = new Map<string, string>(); // Socket ID -> User ID

  // Handle new client connections
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers?.authorization;

      if (!token) {
        console.log("No token provided, disconnecting...");
        client.disconnect();
        return;
      }

      const user = await this.userService.getCurrentUser({ userToken: token });

      if (!user.data || !user.data.id) {
        console.log("Invalid token, disconnecting...");
        client.disconnect();
        return;
      }
      const userId = String(user.data.id);
      this.clients.set(userId, client);
      this.socketToUser.set(client.id, userId);
      console.log(`Client connected: User ID = ${userId}, Socket ID = ${client.id}`);
    } catch (error) {
      console.log("Error in token validation, disconnecting...", error);
      client.disconnect();
    }
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);

    if (userId) {
      this.clients.delete(userId);
      this.socketToUser.delete(client.id);
      console.log(`Client disconnected: User ID = ${userId}, Socket ID = ${client.id}`);
    } else {
      console.log(`Unknown client disconnected: Socket ID = ${client.id}`);
    }
  }

  @SubscribeMessage("message")
  handleMessage(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    console.log(`Message received from User ID = ${userId}, Socket ID = ${client.id}`);
    return "Message received";
  }

  // Send notifications to a specific user
  sendNotification(userId: string, notification: any) {
    const currentClient = this.clients.get(userId);
    if (currentClient) {
      currentClient.emit("notification", notification);
      console.log(`Notification sent to User ID = ${userId}`);
    } else {
      console.log(`User ${userId} is not connected`);
    }
  }

  // Get real user ID from socket ID
  getUserIdFromSocketId(socketId: string): string | undefined {
    return this.socketToUser.get(socketId);
  }
}
