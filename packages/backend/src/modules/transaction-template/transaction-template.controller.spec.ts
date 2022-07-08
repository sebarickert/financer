import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplateController } from './transaction-template.controller';
import { TransactionTemplateService } from './transaction-template.service';

describe('TransactionTemplateController', () => {
  let controller: TransactionTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
        ]),
      ],
      controllers: [TransactionTemplateController],
      providers: [TransactionTemplateService],
    }).compile();

    controller = module.get<TransactionTemplateController>(
      TransactionTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
