import { GetAllCategoriesPort } from '../ports/input/get-all-categories.port';
import { Category } from '../../domain/models/category.model';
import { CategoryRepository } from '../../domain/repository/category.repository';

export class GetAllCategoriesUseCase implements GetAllCategoriesPort {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
