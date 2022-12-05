import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionTemplateLog,
  TransactionTemplateLogSchema,
} from './schemas/transaction-template-log.schema';
import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplatesController } from './transaction-templates.controller';
import { TransactionTemplatesService } from './transaction-templates.service';

describe('TransactionTemplateController', () => {
  let controller: TransactionTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
          {
            name: TransactionTemplateLog.name,
            schema: TransactionTemplateLogSchema,
          },
        ]),
      ],
      controllers: [TransactionTemplatesController],
      providers: [TransactionTemplatesService],
    }).compile();

    controller = module.get<TransactionTemplatesController>(
      TransactionTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
