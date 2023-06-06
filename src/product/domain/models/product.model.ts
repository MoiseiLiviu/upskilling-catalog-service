import { Category } from "../../../category/domain/models/category.model";

export class Product {
  id: number;
  name: string;
  price: number;
  unitsAvailable: number;
  imageUrl: string;
  userId: number;
  categories: Category[];

  constructor(
    id: number,
    name: string,
    price: number,
    unitsAvailable: number,
    imageUrl: string,
    userId: number,
    categories: Category[],
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.unitsAvailable = unitsAvailable;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.categories = categories;
  }
}
