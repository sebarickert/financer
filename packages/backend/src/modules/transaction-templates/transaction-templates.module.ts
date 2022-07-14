import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplatesController } from './transaction-templates.controller';
import { TransactionTemplatesService } from './transaction-templates.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
    ]),
  ],
  controllers: [TransactionTemplatesController],
  providers: [TransactionTemplatesService],
  exports: [TransactionTemplatesService],
})
export class TransactionTemplateModule {}
