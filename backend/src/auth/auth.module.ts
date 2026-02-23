import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TrackPlaylistModule } from 'src/track-playlist/track-playlist.module';

@Module({
  imports: [
    UserModule,
    TrackPlaylistModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_CODE,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
