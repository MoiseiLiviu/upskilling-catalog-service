import { CreateProductCommand } from '../dto/create-product.command';
import { ProductRepository } from '../../domain/repository/product.repository';
import { Product } from '../../domain/models/product.model';
import { GetCategoriesByIdsPort } from '../ports/output/get-categories-by-ids.port';
import { CreateProductPort } from '../ports/input/create-product.port';
import { LoggerPort } from '@nest-upskilling/common';

export class CreateProductUseCase implements CreateProductPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly productRepository: ProductRepository,
    private readonly getCategoriesByIdsPort: GetCategoriesByIdsPort,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    this.loggerPort.log('CreateProductUseCase',
      `Received create product command: ${JSON.stringify(command)}`)
    const categories = await this.getCategoriesByIdsPort.execute(
      command.categoriesIds,
    );
    const product = new Product(
      null,
      command.name,
      command.price,
      command.availableUnits,
      command.imageUrl,
      command.userId,
      categories,
    );

    return this.productRepository.save(product);
  }
}
