import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";

@WebSocketGateway()
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(ChatGateway.name);
	@WebSocketServer() io: Server;

	afterInit() {
		this.logger.log("Initialized");
	}

	handleConnection(client: any) {
		const { sockets } = this.io.sockets;
		this.logger.log(`Client id: ${client.id} connected`);
		this.logger.debug(`Number of connected clients: ${sockets.size}`);
		this.io.on("connected", (socket) => {
			console.log("bruce", socket);
		});
	}

	handleDisconnect(client: any) {
		this.logger.log(`Cliend id:${client.id} disconnected`);
	}

  @SubscribeMessage("public-message")
	handleMessage(client: any, data: any) {
		this.logger.log(`Message received from client id: ${client.id}`);
		this.logger.debug(`Payload: ${data}`);
		this.io.emit(data.channel, { sender: data.sender, message: data.message });
	}

  @SubscribeMessage('private-message')
  handlePrivateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
		this.logger.log(`Message received from client id: ${client.id} to ${data.receiver}`);
		this.io.emit(data.channel, { sender: data.sender, senderId: data.senderId, receiver: data.receiver, receiverId: data.receiverId, message: data.message });
  }

  @SubscribeMessage('announcement-message')
  handleAnnouncementMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    this.logger.log(`Announcement Message type ${data.type} received to client id: ${client.id}`);
		this.io.emit(data.channel, { type: data.type, message: data.message });
  }
}
