import { CategoryEntity } from '../entities/CategoryEntity';
import { Category } from '../../../domain/models/category.model';

export class CategoryMapper {
  public static mapEntityToModel(categoryEntity: CategoryEntity): Category {
    const category = new Category(
      categoryEntity.name,
      categoryEntity.description,
    );
    category.id = categoryEntity.id;
    return category;
  }

  public static mapModelToEntity(category: Category): CategoryEntity {
    const categoryEntity = new CategoryEntity();
    categoryEntity.id = category.id;
    categoryEntity.name = category.name;
    categoryEntity.description = category.description;
    return categoryEntity;
  }
}
