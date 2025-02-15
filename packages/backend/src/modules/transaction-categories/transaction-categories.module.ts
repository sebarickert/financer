import { Module } from '@nestjs/common';

import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';

import { DatabaseModule } from '@/database/database.module';
import { TransactionCategoryMappingsModule } from '@/transaction-category-mappings/transaction-category-mappings.module';

@Module({
  imports: [DatabaseModule, TransactionCategoryMappingsModule],
  controllers: [TransactionCategoriesController],
  providers: [TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
