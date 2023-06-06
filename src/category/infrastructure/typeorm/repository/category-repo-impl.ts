import { CategoryRepository } from '../../../domain/repository/category.repository';
import { Injectable } from '@nestjs/common';
import { Category } from '../../../domain/models/category.model';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/CategoryEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMapper } from '../mapper/category.mapper';

@Injectable()
export class CategoryRepoImpl implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllByIds(ids: number[]): Promise<Category[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder()
      .whereInIds(ids)
      .getMany();

    return categories.map((category) =>
      CategoryMapper.mapEntityToModel(category),
    );
  }

  async save(category: Category): Promise<Category> {
    const categoryEntity = await this.categoryRepository.save(
      CategoryMapper.mapModelToEntity(category),
    );
    return CategoryMapper.mapEntityToModel(categoryEntity);
  }

  async findAll(): Promise<Category[]> {
    const categoryEntities = await this.categoryRepository.find();
    return categoryEntities.map((categoryEntity) =>
      CategoryMapper.mapEntityToModel(categoryEntity),
    );
  }
}
