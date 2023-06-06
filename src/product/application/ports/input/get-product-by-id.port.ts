import { Product } from '../../../domain/models/product.model';

export interface GetProductByIdPort {
  execute(productId: number): Promise<Product>;
}
