import { Injectable } from '@nestjs/common';
import { AuthSocket } from 'src/auth/auth.socket';

@Injectable()
export class WsUsersService {
  public userToSocketMap: Map<string, AuthSocket>;

  constructor() {
    this.userToSocketMap = new Map<string, AuthSocket>();
  }

  add(socket: AuthSocket) {
    this.userToSocketMap.set(socket.userId, socket);
  }

  removeUser(userId: string) {
    this.userToSocketMap.delete(userId);
  }
}
