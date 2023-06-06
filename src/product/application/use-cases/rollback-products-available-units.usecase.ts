import { RollbackProductsAvailableUnitsPort } from '../ports/input/rollback-products-available-units.port';
import { ProductRepository } from '../../domain/repository/product.repository';
import { CartItemDto, LoggerPort } from '@nest-upskilling/common';

export class RollbackProductsAvailableUnitsUseCase
  implements RollbackProductsAvailableUnitsPort
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly loggerPort: LoggerPort,
  ) {}

  async execute(items: CartItemDto[]): Promise<void> {
    this.loggerPort.log(
      'RollbackProductsAvailableUnitsUseCase',
      `Rolling back product available quantities: ${JSON.stringify(items)}`,
    );
    for (const item of items) {
      const product = await this.productRepository.getById(item.productId);
      product.unitsAvailable += item.quantity;
      await this.productRepository.updateUnitsAvailable(
        product.id,
        product.unitsAvailable,
      );
    }
  }
}
