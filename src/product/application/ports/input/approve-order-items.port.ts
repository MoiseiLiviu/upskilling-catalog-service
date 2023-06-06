import { OrderCreatedEvent } from '@nest-upskilling/common';

export interface ApproveOrderItemsPort {
  execute(orderCreatedEvent: OrderCreatedEvent);
}
