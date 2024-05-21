import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { testConfiguration } from '../../config/test-configuration';
import { SystemModule } from '../system/system.module';
import { TransactionTemplateModule } from '../transaction-templates/transaction-templates.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionsService } from '../transactions/transactions.service';
import { UserDataModule } from '../user-data/user-data.module';
import { UserDataService } from '../user-data/user-data.service';

import { TasksService } from './tasks.service';
import { templateFixture } from './template-fixture';

const dummyUserId = '61460d7354ea082ad0256749';

describe('TasksService', () => {
  let service: TasksService;
  let userDataService: UserDataService;
  let transactionsService: TransactionsService;

  let RealDate: DateConstructor;
  let dateMock: Date;

  const mockDate = () => {
    RealDate = Date;
    dateMock = new Date(2022, 8, 2, 12);
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length) {
        return new RealDate(...args);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new RealDate(dateMock) as any;
    });

    (['prototype', 'now'] as const).forEach(
      // @ts-expect-error - We are mocking Date
      (methodName) => (Date[methodName] = RealDate[methodName]),
    );
    Date.now = () => dateMock.getTime();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        UserDataModule,
        TransactionTemplateModule,
        TransactionsModule,
        SystemModule,
      ],
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    userDataService = module.get<UserDataService>(UserDataService);
    transactionsService = module.get<TransactionsService>(TransactionsService);

    mockDate();
  });

  afterEach(async () => {
    // @TODO: Clear database with prisma
    // const connection = await getMongoConnection();
    // const collections = await connection.db.collections();
    // await Promise.all(
    //   collections.map((collection) => collection.deleteMany({})),
    // );
    // await connection.close();

    global.Date = RealDate;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transaction from template', async () => {
    await userDataService.overrideUserData(dummyUserId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(templateFixture as any),
    });

    const transactionsBefore = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsBefore.data).toHaveLength(0);

    await service.generateTransactions();

    const transactionsAfter = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsAfter.data).toHaveLength(1);
  });

  it('should not create duplicated transaction from template with multiple executions', async () => {
    await userDataService.overrideUserData(dummyUserId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(templateFixture as any),
    });

    const transactionsBefore = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsBefore.data).toHaveLength(0);

    await service.generateTransactions();
    await service.generateTransactions();

    const transactionsAfter = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsAfter.data).toHaveLength(1);
  });

  it('should use last day of month id dayOfMonth is higher than amount of days', async () => {
    dateMock = new Date(2022, 1, 2, 12);

    await userDataService.overrideUserData(dummyUserId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(templateFixture as any),
    });

    const transactionsBefore = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsBefore.data).toHaveLength(0);

    await service.generateTransactions();

    const transactionsAfter = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsAfter.data).toHaveLength(1);

    const expectedDate = new Date(2022, 1, 28, 12);
    const transactionDate = transactionsAfter.data[0].date;

    expect(transactionDate.getFullYear()).toBe(expectedDate.getFullYear());
    expect(transactionDate.getMonth()).toBe(expectedDate.getMonth());
    expect(transactionDate.getDate()).toBe(expectedDate.getDate());
  });

  it('should create transaction to next month if dayOfMonthToCreate is greater than dayOfMonth', async () => {
    dateMock = new Date(2022, 0, 30, 12);

    await userDataService.overrideUserData(dummyUserId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(templateFixture as any),
    });

    const transactionsBefore = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsBefore.data).toHaveLength(0);

    await service.generateTransactions();

    const transactionsAfter = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsAfter.data).toHaveLength(1);

    const expectedDate = new Date(2022, 1, 15, 12);
    const transactionDate = transactionsAfter.data[0].date;

    expect(transactionDate.getFullYear()).toBe(expectedDate.getFullYear());
    expect(transactionDate.getMonth()).toBe(expectedDate.getMonth());
    expect(transactionDate.getDate()).toBe(expectedDate.getDate());
  });

  it('should run templates on last day of month even with higher dayOfMonthToCreate values', async () => {
    dateMock = new Date(2022, 1, 28, 12);

    await userDataService.overrideUserData(dummyUserId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(templateFixture as any),
    });

    const transactionsBefore = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsBefore.data).toHaveLength(0);

    await service.generateTransactions();

    const transactionsAfter = await transactionsService.findAllByUser(
      dummyUserId,
      null,
    );

    expect(transactionsAfter.data).toHaveLength(1);

    const expectedDate = new Date(2022, 2, 15, 12);
    const transactionDate = transactionsAfter.data[0].date;

    expect(transactionDate.getFullYear()).toBe(expectedDate.getFullYear());
    expect(transactionDate.getMonth()).toBe(expectedDate.getMonth());
    expect(transactionDate.getDate()).toBe(expectedDate.getDate());
  });
});
