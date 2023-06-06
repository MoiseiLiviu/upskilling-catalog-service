import { CreateCategoryDto } from "../../dto/create-category.dto";
import { Category } from "../../../domain/models/category.model";

export interface CreateCategoryPort {
  execute(createCategoryDto: CreateCategoryDto): Promise<Category>;
}