import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionTemplate,
  TransactionTemplateSchema,
} from './schemas/transaction-template.schema';
import { TransactionTemplateService } from './transaction-template.service';

describe('TransactionTemplateService', () => {
  let service: TransactionTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: TransactionTemplate.name, schema: TransactionTemplateSchema },
        ]),
      ],
      providers: [TransactionTemplateService],
    }).compile();

    service = module.get<TransactionTemplateService>(
      TransactionTemplateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
