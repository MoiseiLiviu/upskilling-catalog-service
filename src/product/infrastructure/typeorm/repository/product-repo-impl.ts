import { ProductRepository } from '../../../domain/repository/product.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../../domain/models/product.model';
import { Repository } from 'typeorm';
import { ProductMapper } from '../mapper/product.mapper';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepoImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const productEntity = await this.productRepository.save(
      ProductMapper.toEntity(product),
    );
    return ProductMapper.fromEntity(productEntity);
  }

  async getById(id: number): Promise<Product> {
    const productEntity = await this.productRepository.findOneBy({ id });
    console.log(JSON.stringify(productEntity));
    return ProductMapper.fromEntity(productEntity);
  }

  transaction<R>(callback: () => Promise<R>): Promise<R> {
    return this.productRepository.manager.transaction(callback);
  }

  async updateUnitsAvailable(
    productId: number,
    unitsAvailable: number,
  ): Promise<void> {
    await this.productRepository.update(productId, { unitsAvailable });
  }
}
