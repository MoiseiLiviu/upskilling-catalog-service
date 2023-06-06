import { Product } from '../models/product.model';

export interface ProductRepository {
  save(product: Product): Promise<Product>;

  updateUnitsAvailable(
    productId: number,
    unitsAvailable: number,
  ): Promise<void>;

  getById(id: number): Promise<Product>;

  transaction<R>(callbacK: () => Promise<R>): Promise<R>;
}
