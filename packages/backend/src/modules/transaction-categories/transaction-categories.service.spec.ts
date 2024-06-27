import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { removeCreatedAndUpdated } from '../../../test/test-helper';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { TransactionCategoriesService } from './transaction-categories.service';

describe('TransactionCategoriesService', () => {
  let service: TransactionCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
        TransactionCategoryMappingsModule,

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [TransactionCategoriesService],
    }).compile();

    service = module.get<TransactionCategoriesService>(
      TransactionCategoriesService,
    );
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  it('should return a transaction category by id', async () => {
    const transactionCategory = await service.findOne(
      DUMMY_TEST_USER.id,
      '623b58ada3deba9879422fbf',
    );
    expect(removeCreatedAndUpdated(transactionCategory)).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findAllByUser', async () => {
    const transactionCategories = await service.findAllByUser(
      DUMMY_TEST_USER.id,
    );
    expect(removeCreatedAndUpdated(transactionCategories)).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findMonthlySummariesByUserAndId', async () => {
    const transactionCategories = await service.findMonthlySummariesByUserAndId(
      DUMMY_TEST_USER.id,
      '623b58ada3deba9879422fbf',
    );
    expect(transactionCategories).toMatchSnapshot();
  });
});
