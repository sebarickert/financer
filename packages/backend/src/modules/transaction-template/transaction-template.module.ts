import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplateController } from './transaction-template.controller';
import { TransactionTemplateService } from './transaction-template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
    ]),
  ],
  controllers: [TransactionTemplateController],
  providers: [TransactionTemplateService],
  exports: [TransactionTemplateService],
})
export class TransactionTemplateModule {}
