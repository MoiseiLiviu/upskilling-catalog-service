import { CreateProductCommand } from '../../dto/create-product.command';
import { Product } from '../../../domain/models/product.model';

export interface CreateProductPort {
  execute(createProductCommand: CreateProductCommand): Promise<Product>;
}
