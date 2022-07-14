import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplatesService as TransactionTemplatesService } from './transaction-templates.service';

describe('TransactionTemplatesService', () => {
  let service: TransactionTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
        ]),
      ],
      providers: [TransactionTemplatesService],
    }).compile();

    service = module.get<TransactionTemplatesService>(
      TransactionTemplatesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
