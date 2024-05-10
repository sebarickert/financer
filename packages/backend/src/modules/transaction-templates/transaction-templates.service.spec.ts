import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';

import { TransactionTemplatesService as TransactionTemplatesService } from './transaction-templates.service';

describe('TransactionTemplatesService', () => {
  let service: TransactionTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
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
