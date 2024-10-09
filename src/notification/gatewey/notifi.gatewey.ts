import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotifiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(readonly userService: UserService) {}
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  // Handle new client connections
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(`Client connected: ${userId}`);

    // Store the client by userId
    if (userId) {
      this.clients.set(userId, client);
    }
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(`Client disconnected: ${userId}`);

    // Remove the client when they disconnect
    if (userId) {
      this.clients.delete(userId);
    }
  }

  // Method to send notifications to a specific user
  sendNotification(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit("notification", notification);
    }
  }

  //Subscribe notificatio MARK AS READ
  //Subscribe notification MARK AS READ
  @SubscribeMessage("markAsRead")
  handleMarkAsRead(client: Socket, notificationId: string) {
    const userId = client.handshake.query.userId as string;
    console.log(`User ${userId} marked notification ${notificationId} as read.`);
  }
}
