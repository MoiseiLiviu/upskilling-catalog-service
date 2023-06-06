import { AbstractEntity } from '@nest-upskilling/common';
import {Column, Entity, JoinTable, ManyToMany,} from 'typeorm';
import { CategoryEntity } from "../../../../category/infrastructure/typeorm/entities/CategoryEntity";

@Entity('product')
export class ProductEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'units_available' })
  unitsAvailable: number;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: CategoryEntity[];

  @Column({name: 'user_id'})
  userId: number;

  constructor(
    name: string,
    price: number,
    imageUrl: string,
    unitsAvailable: number,
    categories: CategoryEntity[],
    userId: number,
  ) {
    super();
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.unitsAvailable = unitsAvailable;
    this.categories = categories;
    this.userId = userId;
  }
}
