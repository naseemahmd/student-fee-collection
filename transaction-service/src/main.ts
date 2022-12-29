import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const conf = app.get<ConfigService>(ConfigService);
  const logger = new Logger();
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [''],
      },
      createTopics: true,
      consumer: {
        groupId: 'transaction-service',
      },
    },
  });
  await app.startAllMicroservices();
  // console.log(`Microservice is listening on ${conf.get('PORT')}`);
  logger.log(`Microservice is listening`);
}
bootstrap();
