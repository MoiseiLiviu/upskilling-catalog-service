import { ProductRepository } from '../../domain/repository/product.repository';
import { Product } from '../../domain/models/product.model';
import { Inject } from '@nestjs/common';
import { ProductRepositoryToken } from '../../tokens/product.tokens';
import { GetProductByIdPort } from '../ports/input/get-product-by-id.port';

export class GetProductByIdUseCase implements GetProductByIdPort {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(productId: number): Promise<Product> {
    return this.productRepository.getById(productId);
  }
}
