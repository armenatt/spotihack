import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({ credentials: true, origin: 'http://localhost:3001' });
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.register(fastifyCookie, {
    secret: String(process.env.SECRET_CODE),
  });

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'spotihack-backend',
        brokers: ['kafka:9092'],
      },
      consumer: {
        allowAutoTopicCreation: true,
        groupId: 'spotihack-backend',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
