import { Module } from '@nestjs/common';

import { TransactionCategoryMappingsController } from './transaction-category-mappings.controller';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

@Module({
  controllers: [TransactionCategoryMappingsController],
  providers: [TransactionCategoryMappingsService],
})
export class TransactionCategoryMappingsModule {}
