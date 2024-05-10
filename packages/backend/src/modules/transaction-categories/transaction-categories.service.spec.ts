import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

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
    jest.useFakeTimers({
      // do not fake nextTick behavior for mongo in memory
      doNotFake: ['nextTick'],
      now: new Date('2022-01-30T11:00:00.00Z'),
    });

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

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return a transaction category by id', async () => {
    const transactionCategory = await service.findOne(
      DUMMY_TEST_USER.id,
      '623b58ada3deba9879422fbf',
    );
    expect(transactionCategory).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findAllByUser', async () => {
    const transactionCategories = await service.findAllByUser(
      DUMMY_TEST_USER.id,
    );
    expect(transactionCategories).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findMonthlySummariesByUserAndId', async () => {
    const transactionCategories = await service.findMonthlySummariesByUserAndId(
      DUMMY_TEST_USER.id,
      '623b58ada3deba9879422fbf',
    );
    expect(transactionCategories).toMatchSnapshot();
  });
});
