import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { parseObjectId } from '../../types/objectId';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import {
  TransactionCategoryMapping,
  TransactionCategoryMappingSchema,
} from './schemas/transaction-category-mapping.schema';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsService', () => {
  let service: TransactionCategoryMappingsService;

  beforeEach(async () => {
    jest.useFakeTimers({
      // do not fake nextTick behavior for mongo in memory
      doNotFake: ['nextTick'],
      now: new Date('2022-01-30T11:00:00.00Z'),
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: TransactionCategoryMapping.name,
            schema: TransactionCategoryMappingSchema,
          },
        ]),

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [TransactionCategoryMappingsService],
    }).compile();

    service = module.get<TransactionCategoryMappingsService>(
      TransactionCategoryMappingsService,
    );
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER._id,
      fixtureData as unknown as ImportUserDataDto,
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return all transactionCategoryMappings by user', async () => {
    const transactionCategoryMappings = await service.findAllByUser(
      DUMMY_TEST_USER._id,
    );
    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return all transactionCategoryMappings by user and category ids', async () => {
    const transactionCategoryMappings =
      await service.findAllByUserAndCategoryIds(DUMMY_TEST_USER._id, [
        parseObjectId('623b58ada3deba9879422fbf'),
      ]);
    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return all transactionCategoryMappings by user and transaction id', async () => {
    const transactionCategoryMappings =
      await service.findAllByUserAndTransaction(
        DUMMY_TEST_USER._id,
        parseObjectId('624befb66ba655edad8f824e'),
      );
    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return all transactionCategoryMappings by user and category ids', async () => {
    const transactionCategoryMappings =
      await service.findMonthlySummariesByUserAndId(DUMMY_TEST_USER._id, [
        parseObjectId('623b58ada3deba9879422fbf'),
      ]);
    expect(transactionCategoryMappings).toMatchSnapshot();
  });
});
