import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: "notification",
  cors: {
    origin: "*",
  },
})
export class NotifiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();

  // Handle new client connections
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set("userId", client);
    }
    console.log(`Client connected: ${userId}`);
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage("message")
  handleMessage() {
    const user = this.clients.get("userId");
    console.log(user);
    return "testing";
  }

  // Method to send notifications to a specific user
  sendNotification(userId: string, notification: any) {
    const currenClient = this.clients.get("userId");
    if (currenClient) {
      currenClient.emit("notification", notification);
    }
  }
}
