import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

export class NotifiGatewey {
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }
    async handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('notification')
    async handleJoin(client: Socket, recipientId: string) {
        client.join(recipientId);
        console.log(`Client ${client.id} joined room ${recipientId}`);
    }

    async sendNotification(recipientId: string, notification: any) {
        console.log(`Sending notification to room ${recipientId}`);
        this.server.to(recipientId).emit('newNotification', notification);
    }
  

}