import { CreateCategoryPort } from '../ports/input/create-category.port';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryRepository } from '../../domain/repository/category.repository';
import { Category } from "../../domain/models/category.model";

export class CreateCategoryUseCase implements CreateCategoryPort {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category(createCategoryDto.name, createCategoryDto.description);
    return await this.categoryRepository.save(category);
  }
}
