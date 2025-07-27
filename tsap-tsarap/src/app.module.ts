import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from 'nestjs-s3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link/link.entity';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'tsap-tsarap-doer',
            brokers: ['kafka:9092'],
          },
        },
      },
    ]),
    S3Module.forRoot({
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID!,
          secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.S3_ENDPOINT,
        region: 'garage',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'tsap-tsarap.sqlite',
      synchronize: true,
      entities: [Link],
    }),
    TypeOrmModule.forFeature([Link]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
