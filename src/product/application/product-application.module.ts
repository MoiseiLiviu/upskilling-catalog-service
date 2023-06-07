import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './use-cases/create-product.usecase';
import { CategoryApplicationModule } from '../../category/application/category-application.module';
import {
  APPROVE_ORDER_ITEMS_USE_CASE,
  CHECK_AVAILABILITY_USE_CASE,
  CREATE_PRODUCT_USE_CASE,
  GET_PRODUCT_BY_ID_USE_CASE,
  OutboxRepositoryToken,
  ProductRepositoryToken,
  ROLLBACK_PRODUCTS_AVAILABLE_QUANTITY,
} from '../tokens/product.tokens';
import { ProductRepository } from '../domain/repository/product.repository';
import { CheckAvailabilityUseCase } from './use-cases/check-availability.usecase';
import { GetCategoriesByIdsPort } from './ports/output/get-categories-by-ids.port';
import { GetCategoriesByIdsAdapterToken } from '../../category/tokens/category.tokens';
import { GetProductByIdUseCase } from './use-cases/get-product-by-id.usecase';
import { ApproveOrderItemsUseCase } from './use-cases/approve-order-items.usecase';
import {
  LoggerAdapterToken,
  LoggerModule,
  LoggerPort,
} from '@nest-upskilling/common';
import { ProductInfrastructureModule } from '../infrastructure/product-infrastructure.module';
import { OutboxRepository } from '../domain/repository/outbox.repository';
import { OutboxEventsScheduler } from './outbox/outbox-events.scheduler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboxCleanerScheduler } from './outbox/outbox-cleaner.scheduler';
import { RollbackProductsAvailableUnitsUseCase } from './use-cases/rollback-products-available-units.usecase';

require('dotenv').config();

@Module({
  imports: [
    ProductInfrastructureModule,
    CategoryApplicationModule,
    LoggerModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
          },
          consumer: {
            groupId: 'catalog-service-group',
          },
        },
      },
    ]),
  ],
  providers: [
    OutboxEventsScheduler,
    OutboxCleanerScheduler,
    {
      provide: ROLLBACK_PRODUCTS_AVAILABLE_QUANTITY,
      inject: [ProductRepositoryToken, LoggerAdapterToken],
      useFactory: (
        productRepository: ProductRepository,
        loggerPort: LoggerPort,
      ) =>
        new RollbackProductsAvailableUnitsUseCase(
          productRepository,
          loggerPort,
        ),
    },
    {
      provide: CREATE_PRODUCT_USE_CASE,
      inject: [
        LoggerAdapterToken,
        ProductRepositoryToken,
        GetCategoriesByIdsAdapterToken,
      ],
      useFactory: (
        loggerPort: LoggerPort,
        productRepository: ProductRepository,
        getCategoriesByIdsPort: GetCategoriesByIdsPort,
      ) =>
        new CreateProductUseCase(
          loggerPort,
          productRepository,
          getCategoriesByIdsPort,
        ),
    },
    {
      provide: GET_PRODUCT_BY_ID_USE_CASE,
      inject: [ProductRepositoryToken],
      useFactory: (productRepository: ProductRepository) =>
        new GetProductByIdUseCase(productRepository),
    },
    {
      provide: CHECK_AVAILABILITY_USE_CASE,
      inject: [ProductRepositoryToken],
      useFactory: (productRepository: ProductRepository) =>
        new CheckAvailabilityUseCase(productRepository),
    },
    {
      provide: APPROVE_ORDER_ITEMS_USE_CASE,
      inject: [
        LoggerAdapterToken,
        ProductRepositoryToken,
        OutboxRepositoryToken,
      ],
      useFactory: (
        loggerPort: LoggerPort,
        productRepository: ProductRepository,
        outboxRepository: OutboxRepository,
      ) =>
        new ApproveOrderItemsUseCase(
          loggerPort,
          productRepository,
          outboxRepository,
        ),
    },
  ],
  exports: [
    CHECK_AVAILABILITY_USE_CASE,
    GET_PRODUCT_BY_ID_USE_CASE,
    CREATE_PRODUCT_USE_CASE,
    APPROVE_ORDER_ITEMS_USE_CASE,
    ROLLBACK_PRODUCTS_AVAILABLE_QUANTITY,
  ],
})
export class ProductApplicationModule {}
