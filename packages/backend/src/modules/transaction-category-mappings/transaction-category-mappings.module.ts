import { Module } from '@nestjs/common';

import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TransactionCategoryMappingsService],
  exports: [TransactionCategoryMappingsService],
})
export class TransactionCategoryMappingsModule {}
