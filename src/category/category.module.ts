import { Module } from '@nestjs/common';
import { CategoryTypeormModule } from './infrastructure/typeorm/category-typeorm.module';
import { CategoryApplicationModule } from './application/category-application.module';
import { CategoryInterfaceModule } from './interface/category-interface.module';

@Module({
  imports: [
    CategoryTypeormModule,
    CategoryApplicationModule,
    CategoryInterfaceModule,
  ],
})
export class CategoryModule {}
