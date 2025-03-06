import { Module } from '@nestjs/common';

import { TransactionTemplatesController } from './transaction-templates.controller';
import { TransactionTemplatesService } from './transaction-templates.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionTemplatesController],
  providers: [TransactionTemplatesService],
  exports: [TransactionTemplatesService],
})
export class TransactionTemplateModule {}
