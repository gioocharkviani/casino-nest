import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { NotificationService } from "./notification.service";
import { Server, Socket } from "socket.io";
import { forwardRef, Inject } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*", // Allow any origin for CORS
  },
})
export class NotifiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

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

  // Mark notification as read
  markAsReadNotification(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit("markAsRead", notification);
    }
  }

  // Delete a notification
  handleRemoveNotification(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit("removeNotification", notification);
    }
  }
}
