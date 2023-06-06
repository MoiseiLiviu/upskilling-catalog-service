import { Module } from '@nestjs/common';
import { ProductController } from './interface/grpc/product.controller';
import { ProductApplicationModule } from './application/product-application.module';
import { ProductKafkaController } from './interface/messaging/product-kafka.controller';
import { LoggerModule } from '@nest-upskilling/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ProductApplicationModule, LoggerModule, ScheduleModule.forRoot()],
  controllers: [ProductController, ProductKafkaController],
})
export class ProductModule {}
