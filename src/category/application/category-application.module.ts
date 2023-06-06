import { Module } from '@nestjs/common';
import {
  CategoryRepositoryToken,
  CREATE_CATEGORY_USE_CASE,
  GET_ALL_CATEGORIES_USE_CASE,
  GetCategoriesByIdsAdapterToken,
} from '../tokens/category.tokens';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryRepository } from '../domain/repository/category.repository';
import { CategoryTypeormModule } from '../infrastructure/typeorm/category-typeorm.module';
import { GetAllCategoriesUseCase } from './usecases/get-all-categories.usecase';
import { GetCategoriesByIdsAdapter } from './adapters/get-categories-by-ids.adapter';

@Module({
  imports: [CategoryTypeormModule],
  providers: [
    {
      inject: [CategoryRepositoryToken],
      provide: CREATE_CATEGORY_USE_CASE,
      useFactory: (categoryRepository: CategoryRepository) =>
        new CreateCategoryUseCase(categoryRepository),
    },
    {
      inject: [CategoryRepositoryToken],
      provide: GET_ALL_CATEGORIES_USE_CASE,
      useFactory: (categoryRepository: CategoryRepository) =>
        new GetAllCategoriesUseCase(categoryRepository),
    },
    {
      inject: [CategoryRepositoryToken],
      provide: GetCategoriesByIdsAdapterToken,
      useFactory: (categoryRepository: CategoryRepository) =>
        new GetCategoriesByIdsAdapter(categoryRepository),
    },
  ],
  exports: [
    CREATE_CATEGORY_USE_CASE,
    GET_ALL_CATEGORIES_USE_CASE,
    GetCategoriesByIdsAdapterToken,
  ],
})
export class CategoryApplicationModule {}
