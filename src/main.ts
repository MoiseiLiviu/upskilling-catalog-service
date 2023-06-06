import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['category', 'product'],
      protoPath: [
        'node_modules/upskilling-protos/proto/category.proto',
        'node_modules/upskilling-protos/proto/product.proto',
      ],
      url: 'localhost:5002',
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'catalog-service-group',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
