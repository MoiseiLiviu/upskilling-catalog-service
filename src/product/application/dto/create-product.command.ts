export class CreateProductCommand {
  name: string;
  availableUnits: number;
  price: number;
  imageUrl: string;
  userId: number;
  categoriesIds: number[];

  constructor(
    name: string,
    availableUnits: number,
    price: number,
    imageUrl: string,
    userId: number,
    categoriesIds: number[],
  ) {
    this.name = name;
    this.availableUnits = availableUnits;
    this.price = price;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.categoriesIds = categoriesIds;
  }
}
