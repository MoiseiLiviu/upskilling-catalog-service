import { CartItemDto } from '@nest-upskilling/common';

export interface RollbackProductsAvailableUnitsPort {
  execute(products: CartItemDto[]): Promise<void>;
}
