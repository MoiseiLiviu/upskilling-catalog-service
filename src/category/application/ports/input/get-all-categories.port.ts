import { Category } from '../../../domain/models/category.model';

export interface GetAllCategoriesPort {
  execute(): Promise<Category[]>;
}
