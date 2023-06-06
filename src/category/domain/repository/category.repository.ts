import { Category } from '../models/category.model';

export interface CategoryRepository {
  save(category: Category): Promise<Category>;

  findAllByIds(ids: number[]): Promise<Category[]>;

  findAll(): Promise<Category[]>;
}
