import { AbstractEntity } from '@nest-upskilling/common';
import { Column, Entity, ManyToMany } from "typeorm";

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  // @ManyToMany(() => ProductEntity, (fbsfs) => fbsfs.categories)
  // products: ProductEntity[];
}
