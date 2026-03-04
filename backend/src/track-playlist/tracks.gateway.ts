/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { AuthSocket } from 'src/auth/auth.socket';
import { getCookieFromHeader } from 'src/helpers/getCookieFromHeader';
import { WsUsersService } from 'src/ws-users/ws-users.service';
import { Server } from 'ws';

@WebSocketGateway({ path: '/ws', transports: ['websocket'] })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private wsUsersService: WsUsersService,
  ) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(
      'WebSocket server initialized on port ' + server.options.port || 3000,
    );
  }

  async handleConnection(client: AuthSocket, message: IncomingMessage) {
    const cookies = message.headers['cookie'] || '';

    const token = getCookieFromHeader(cookies, 'authentication');

    if (!token.length) {
      client.terminate();
      return;
    }

    const secret = this.configService.getOrThrow('SECRET_CODE');
    const result = await this.jwtService.verifyAsync(token, {
      secret,
    });

    client.userId = result.id;
    this.wsUsersService.add(client);

    if (!result) {
      client.terminate();
    }
  }

  handleDisconnect(client: AuthSocket) {
    this.wsUsersService.removeUser(client.userId);
  }
}
