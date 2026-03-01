import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TrackPlaylistModule } from './track-playlist/track-playlist.module';
import { Track } from './track-playlist/entities/track.entity';
import { Playlist } from './track-playlist/entities/playlist.entity';
import { PlaylistTrack } from './track-playlist/entities/playlist-track.entity';
import { WsUsersModule } from './ws-users/ws-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'armenat',
      password: 'armenat',
      database: 'spotihack',
      entities: [User, Track, Playlist, PlaylistTrack],
      synchronize: true,
    }),
    UserModule,
    TrackPlaylistModule,
    AuthModule,
    TrackPlaylistModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WsUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
