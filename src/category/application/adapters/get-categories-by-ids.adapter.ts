import { Category } from "../../domain/models/category.model";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { GetCategoriesByIdsPort } from "../../../product/application/ports/output/get-categories-by-ids.port";

export class GetCategoriesByIdsAdapter implements GetCategoriesByIdsPort {

  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.findAllByIds(ids);
  }
}
