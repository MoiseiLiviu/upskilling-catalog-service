import { ProductEntity } from '../entities/product.entity';
import { Product } from '../../../domain/models/product.model';
import { CategoryMapper } from '../../../../category/infrastructure/typeorm/mapper/category.mapper';

export class ProductMapper {
  static fromEntity(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.price,
      entity.unitsAvailable,
      entity.imageUrl,
      entity.userId,
      entity.categories
        ? entity.categories.map((category) =>
            CategoryMapper.mapEntityToModel(category),
          )
        : null,
    );
  }

  static toEntity(model: Product): ProductEntity {
    return new ProductEntity(
      model.name,
      model.price,
      model.imageUrl,
      model.unitsAvailable,
      model.categories
        ? model.categories.map((category) =>
            CategoryMapper.mapModelToEntity(category),
          )
        : null,
      model.userId,
    );
  }
}
