import { Module } from '@nestjs/common';
import { WsUsersService } from './ws-users.service';

@Module({
  providers: [WsUsersService]
})
export class WsUsersModule {}
