import { Category } from "../../../../category/domain/models/category.model";

export interface GetCategoriesByIdsPort {
  execute(ids: number[]): Promise<Category[]>;
}
