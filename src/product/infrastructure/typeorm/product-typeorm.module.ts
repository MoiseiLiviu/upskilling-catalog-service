import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import {
  OutboxRepositoryToken,
  ProductRepositoryToken,
} from '../../tokens/product.tokens';
import { ProductRepoImpl } from './repository/product-repo-impl';
import { OutboxEntity } from './entities/outbox.entity';
import { OutboxRepoImpl } from './repository/outbox-repo.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, OutboxEntity])],
  providers: [
    {
      provide: OutboxRepositoryToken,
      useClass: OutboxRepoImpl,
    },
    {
      provide: ProductRepositoryToken,
      useClass: ProductRepoImpl,
    },
  ],
  exports: [ProductRepositoryToken, OutboxRepositoryToken],
})
export class ProductTypeormModule {}
