import { Module } from '@nestjs/common';
import { TrackPlaylistService } from './track-playlist.service';
import { TrackPlaylistController } from './track-playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { S3Module } from 'nestjs-s3';
import { UserModule } from 'src/user/user.module';
import { Playlist } from './entities/playlist.entity';
import { Track } from './entities/track.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Playlist, Track]),
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
            clientId: 'spotihack-backend',
          },
        },
      },
    ]),
    S3Module.forRoot({
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'GK3b0cd22e042f16d0c8ebca0a',
          secretAccessKey:
            '4675eb675cad4ce0b23bceb9f5a62312b3c8e4a3f187576811fd9493571a5513',
        },
        endpoint: 'http://garage:3900',
        region: 'garage',
      },
    }),
  ],
  providers: [TrackPlaylistService],
  exports: [TrackPlaylistService],
  controllers: [TrackPlaylistController],
})
export class TrackPlaylistModule {}
