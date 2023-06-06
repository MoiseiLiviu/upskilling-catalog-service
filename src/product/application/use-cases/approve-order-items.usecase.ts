import { ApproveOrderItemsPort } from '../ports/input/approve-order-items.port';
import {
  CartItem,
  CartItemDto,
  FailedCheckDto,
  FailedProductApprovalDto,
  LoggerPort,
  OrderCreatedEvent,
  OrderItemsApprovedEvent,
  OrderItemsRejectedEvent,
  OutboxStatus,
  ProductApprovalFailReason,
  SagaStatus,
} from '@nest-upskilling/common';
import { ProductRepository } from '../../domain/repository/product.repository';
import { Product } from '../../domain/models/product.model';
import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { Outbox } from '../../domain/models/outbox';
import {
  CatalogItemsApprovedEventTopic,
  CatalogItemsRejectedEventTopic,
} from '../../tokens/product.tokens';

export class ApproveOrderItemsUseCase implements ApproveOrderItemsPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly productRepository: ProductRepository,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(orderCreatedEvent: OrderCreatedEvent) {
    this.loggerPort.log(
      'ApproveOrderItemsUseCase',
      `Approving order by event :${JSON.stringify(orderCreatedEvent)}`,
    );

    const failedApprovals = [];
    const products: Product[] = [];
    for (const item of orderCreatedEvent.items) {
      const product = await this.productRepository.getById(item.productId);
      const failedChecks = this.isProductRequestValid(item, product);
      if (failedChecks && failedChecks.length !== 0) {
        failedApprovals.push(
          new FailedProductApprovalDto(item.productId, failedChecks),
        );
      } else {
        product.unitsAvailable -= item.quantity;
        products.push(product);
      }
    }

    if (failedApprovals.length != 0) {
      await this.rejectOrder(
        orderCreatedEvent.orderId,
        orderCreatedEvent.sagaId,
        failedApprovals,
      );
    } else {
      await this.approveOrder(
        products,
        orderCreatedEvent.orderId,
        orderCreatedEvent.sagaId,
        orderCreatedEvent.items,
      );
    }
  }

  async rejectOrder(
    orderId: number,
    sagaId: string,
    failedProductApprovals: FailedProductApprovalDto[],
  ) {
    const event = new OrderItemsRejectedEvent(
      orderId,
      failedProductApprovals,
      sagaId,
    );

    await this.outboxRepository.save(
      new Outbox(
        null,
        OutboxStatus.STARTED,
        SagaStatus.PROCESSING,
        JSON.stringify(event),
        CatalogItemsRejectedEventTopic,
        sagaId,
      ),
    );
  }

  async approveOrder(
    products: Product[],
    orderId: number,
    sagaId: string,
    items: CartItemDto[],
  ) {
    const event = new OrderItemsApprovedEvent(orderId, sagaId, items);

    await this.productRepository.transaction(async () => {
      for (const product of products) {
        await this.productRepository.updateUnitsAvailable(
          product.id,
          product.unitsAvailable,
        );
      }

      await this.outboxRepository.save(
        new Outbox(
          null,
          OutboxStatus.STARTED,
          SagaStatus.PROCESSING,
          JSON.stringify(event),
          CatalogItemsApprovedEventTopic,
          sagaId,
        ),
      );
    });
  }

  isProductRequestValid(
    cartItem: CartItem,
    product: Product,
  ): FailedCheckDto[] {
    const failedChecks = [];
    if (!product) {
      failedChecks.push(
        new FailedCheckDto(
          ProductApprovalFailReason.NOT_FOUND,
          `Product with id ${cartItem.productId} was not found!`,
        ),
      );
      return failedChecks;
    }
    if (cartItem.quantity > product.unitsAvailable) {
      failedChecks.push(
        new FailedCheckDto(
          ProductApprovalFailReason.NOT_ENOUGH_UNITS,
          `Product with id: ${cartItem.productId} is not available in required capacity.
           Actual available stock: ${product.unitsAvailable}, required quantity: ${cartItem.quantity}`,
        ),
      );
    }
    if (cartItem.price !== product.price) {
      failedChecks.push(
        new FailedCheckDto(
          ProductApprovalFailReason.DIFFERENT_PRICE,
          `Price presented to customer: ${cartItem.price}, is not equal to actual price :${product.price}`,
        ),
      );
    }

    return failedChecks;
  }
}
