import { Controller, Inject } from "@nestjs/common";
import {
  LoggerAdapterToken,
  LoggerPort,
  OrderCreatedEvent,
  PaymentProcessingFailedEvent
} from "@nest-upskilling/common";
import { Ctx, KafkaContext, MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { APPROVE_ORDER_ITEMS_USE_CASE, ROLLBACK_PRODUCTS_AVAILABLE_QUANTITY } from "../../tokens/product.tokens";
import { ApproveOrderItemsPort } from "../../application/ports/input/approve-order-items.port";
import {
  RollbackProductsAvailableUnitsPort
} from "../../application/ports/input/rollback-products-available-units.port";

@Controller()
export class ProductKafkaController {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject(APPROVE_ORDER_ITEMS_USE_CASE)
    private readonly approveOrderItemsPort: ApproveOrderItemsPort,
    @Inject(ROLLBACK_PRODUCTS_AVAILABLE_QUANTITY)
    private readonly rollbackProductsAvailableUnitsPort: RollbackProductsAvailableUnitsPort
  ) {
  }

  @MessagePattern("order.created", Transport.KAFKA)
  async handleOrderApproved(
    @Payload() orderCreatedEvent: OrderCreatedEvent
  ): Promise<void> {
    this.loggerPort.log(
      "ProductKafkaController",
      `Received order created event: ${JSON.stringify(orderCreatedEvent)}`
    );
    this.approveOrderItemsPort.execute(orderCreatedEvent);
  }

  @MessagePattern("order.payment.failed", Transport.KAFKA)
  async handlePaymentFailed(
    @Payload() paymentProcessingFailedEvent: PaymentProcessingFailedEvent,
    @Ctx() context: KafkaContext,
  ){
    this.loggerPort.log(
      'ProductKafkaController',
      `Received event on topic ${context.getTopic()} with message ${JSON.stringify(
        paymentProcessingFailedEvent,
      )}`,
    );

    await this.rollbackProductsAvailableUnitsPort.execute(paymentProcessingFailedEvent.items);
  }
}
