import { Module } from '@nestjs/common';
import { CategoryApplicationModule } from '../application/category-application.module';
import { CategoryController } from "./category.controller";

@Module({
  imports: [CategoryApplicationModule],
  controllers: [CategoryController]
})
export class CategoryInterfaceModule {}
