import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetAllCategoriesRequest,
  GetAllCategoriesResponse,
} from '../proto/category.pb';
import {
  CREATE_CATEGORY_USE_CASE,
  GET_ALL_CATEGORIES_USE_CASE,
} from '../tokens/category.tokens';
import { CreateCategoryPort } from '../application/ports/input/create-category.port';
import { GetAllCategoriesPort } from '../application/ports/input/get-all-categories.port';

@Controller()
export class CategoryController {
  constructor(
    @Inject(CREATE_CATEGORY_USE_CASE)
    private readonly createCategoryPort: CreateCategoryPort,
    @Inject(GET_ALL_CATEGORIES_USE_CASE)
    private readonly getAllCategoriesPort: GetAllCategoriesPort,
  ) {}

  @GrpcMethod('CategoryService', 'CreateCategory')
  async createCategory(
    payload: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    try {
      const category = await this.createCategoryPort.execute(payload);
      return {
        status: 201,
        error: null,
        categoryId: category.id,
      };
    } catch (ex: any) {
      return {
        status: 500,
        error: ex.message,
        categoryId: null,
      };
    }
  }

  @GrpcMethod('CategoryService', 'GetAll')
  async getAll(
    _payload: GetAllCategoriesRequest,
  ): Promise<GetAllCategoriesResponse> {
    const categories = await this.getAllCategoriesPort.execute();
    return {
      categories
    };
  }
}
