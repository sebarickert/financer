import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';

import {
  TransactionCategory,
  TransactionCategorySchema,
} from './schemas/transaction-category.schema';
import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionCategory.name, schema: TransactionCategorySchema },
    ]),
    TransactionCategoryMappingsModule,
  ],
  controllers: [TransactionCategoriesController],
  providers: [TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
