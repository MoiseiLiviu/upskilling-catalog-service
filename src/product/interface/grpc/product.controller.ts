import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CheckProductAvailabilityRequest,
  CheckProductAvailabilityResponse,
  CreateProductRequest,
  GetProductByIdRequest,
  ProductPayload,
} from '../../proto/product.pb';
import { CreateProductCommand } from '../../application/dto/create-product.command';
import {
  CHECK_AVAILABILITY_USE_CASE,
  CREATE_PRODUCT_USE_CASE,
  GET_PRODUCT_BY_ID_USE_CASE,
} from '../../tokens/product.tokens';
import { CheckAvailabilityPort } from '../../application/ports/input/check-availability.port';
import { CreateProductPort } from '../../application/ports/input/create-product.port';
import { GetProductByIdPort } from '../../application/ports/input/get-product-by-id.port';

@Controller()
export class ProductController {
  constructor(
    @Inject(CREATE_PRODUCT_USE_CASE)
    private readonly createProductPort: CreateProductPort,
    @Inject(GET_PRODUCT_BY_ID_USE_CASE)
    private readonly getProductByIdPort: GetProductByIdPort,
    @Inject(CHECK_AVAILABILITY_USE_CASE)
    private readonly checkAvailabilityPort: CheckAvailabilityPort,
  ) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(payload: CreateProductRequest): Promise<ProductPayload> {
    return await this.createProductPort.execute(
      new CreateProductCommand(
        payload.name,
        payload.unitsAvailable,
        payload.price,
        payload.imageUrl,
        payload.userId,
        payload.categoriesId,
      ),
    );
  }

  @GrpcMethod('ProductService', 'GetById')
  async getById(payload: GetProductByIdRequest): Promise<ProductPayload> {
    return await this.getProductByIdPort.execute(payload.id);
  }

  @GrpcMethod('ProductService', 'CheckProductAvailability')
  async checkAvailability(
    payload: CheckProductAvailabilityRequest,
  ): Promise<CheckProductAvailabilityResponse> {
    const isAvailable: boolean = await this.checkAvailabilityPort.execute(
      payload.productId,
      payload.quantity,
    );
    return {
      isAvailable,
    };
  }
}
