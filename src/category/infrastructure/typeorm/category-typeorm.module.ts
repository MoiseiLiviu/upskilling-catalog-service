import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/CategoryEntity';
import { CategoryRepositoryToken } from '../../tokens/category.tokens';
import { CategoryRepoImpl } from './repository/category-repo-impl';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoryRepositoryToken,
      useClass: CategoryRepoImpl,
    },
  ],
  exports: [CategoryRepositoryToken],
})
export class CategoryTypeormModule {}
