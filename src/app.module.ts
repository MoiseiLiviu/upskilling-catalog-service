import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '@nest-upskilling/common';
import { CategoryEntity } from './category/infrastructure/typeorm/entities/CategoryEntity';
import { ProductModule } from "./product/product.module";
import { ProductEntity } from "./product/infrastructure/typeorm/entities/product.entity";
import { OutboxEntity } from "./product/infrastructure/typeorm/entities/outbox.entity";

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService, [CategoryEntity, ProductEntity, OutboxEntity]),
    }),
  ],
})
export class AppModule {}
