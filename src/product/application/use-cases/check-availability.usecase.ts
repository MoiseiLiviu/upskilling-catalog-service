import { CheckAvailabilityPort } from '../ports/input/check-availability.port';
import { ProductRepository } from '../../domain/repository/product.repository';

export class CheckAvailabilityUseCase implements CheckAvailabilityPort {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: number, quantity: number): Promise<boolean> {
    const product = await this.productRepository.getById(productId);
    return product.unitsAvailable >= quantity;
  }
}
