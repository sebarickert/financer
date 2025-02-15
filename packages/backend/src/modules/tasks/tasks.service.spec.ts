import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';

import { TasksService } from './tasks.service';

import { AccountsService } from '@/accounts/accounts.service';
import { transactionTemplateAllByUserRepoMockData } from '@/database/repos/mocks/transaction-template-repo-mock';
import { transactionsRepoFindAllByIdMockData } from '@/database/repos/mocks/transactions-repo-mock';
import { SystemLogRepo } from '@/database/repos/system-log.repo';
import { TransactionTemplateLogRepo } from '@/database/repos/transaction-template-log.repo';
import { TransactionTemplateRepo } from '@/database/repos/transaction-template.repo';
import { TransactionRepo } from '@/database/repos/transaction.repo';
import { SystemService } from '@/system/system.service';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';
import { TransactionCategoriesService } from '@/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '@/transaction-category-mappings/transaction-category-mappings.service';
import { TransactionTemplatesService } from '@/transaction-templates/transaction-templates.service';
import { TransactionsService } from '@/transactions/transactions.service';

const dummyUserId = '61460d7354ea082ad0256749';

describe('TasksService', () => {
  let service: TasksService;

  let transactionRepo: jest.Mocked<TransactionRepo>;
  let systemLogRepo: jest.Mocked<SystemLogRepo>;
  let transactionTemplateRepo: jest.Mocked<TransactionTemplateRepo>;
  let transactionTemplateLogRepo: jest.Mocked<TransactionTemplateLogRepo>;

  let RealDate: DateConstructor;
  let dateMock: Date;

  const mockDate = () => {
    RealDate = Date;
    dateMock = new Date(2022, 8, 2, 12);
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (args.length) {
        return new RealDate(...args);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      return new RealDate(dateMock) as any;
    });

    (['prototype', 'now'] as const).forEach(
      // @ts-expect-error - We are mocking Date
      (methodName) => (Date[methodName] = RealDate[methodName]),
    );
    Date.now = () => dateMock.getTime();
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        TransactionsService,
        TransactionTemplatesService,
        SystemService,
        createMockServiceProvider(AccountsService),
        createMockServiceProvider(TransactionCategoriesService),
        createMockServiceProvider(TransactionCategoryMappingsService),
        createMockServiceProvider(TransactionRepo),
        createMockServiceProvider(SystemLogRepo),
        createMockServiceProvider(TransactionTemplateRepo),
        createMockServiceProvider(TransactionTemplateLogRepo),
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    transactionRepo = module.get<jest.Mocked<TransactionRepo>>(TransactionRepo);
    systemLogRepo = module.get<jest.Mocked<SystemLogRepo>>(SystemLogRepo);
    transactionTemplateRepo = module.get<jest.Mocked<TransactionTemplateRepo>>(
      TransactionTemplateRepo,
    );
    transactionTemplateLogRepo = module.get<
      jest.Mocked<TransactionTemplateLogRepo>
    >(TransactionTemplateLogRepo);
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transaction from template', async () => {
    jest
      .spyOn(transactionTemplateRepo, 'findMany')
      .mockResolvedValueOnce(transactionTemplateAllByUserRepoMockData);
    jest
      .spyOn(transactionTemplateLogRepo, 'findMany')
      .mockResolvedValueOnce([]);
    jest.spyOn(transactionRepo, 'create').mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      transactionsRepoFindAllByIdMockData['624befb66ba655edad8f824e'],
    );

    await service.generateTransactions();

    expect(transactionTemplateRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateRepo.findMany).toHaveBeenCalledWith({
      where: {
        dayOfMonthToCreate: {
          equals: 2,
        },
        templateType: {
          has: 'AUTO',
        },
      },
    });

    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledWith({
      where: {
        eventType: 'AUTO',
        executed: {
          gt: new Date('2022-08-30T21:00:00.000Z'),
        },
        templateId: {
          in: ['638da86a4ce377d764461255'],
        },
      },
    });

    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create).toHaveBeenCalledWith({
      amount: new Decimal('200'),
      date: new Date('2022-09-30T09:00:00.000Z'),
      description: 'Test template 2',
      fromAccount: null,
      toAccount: '61460da354ea082ad025676b',
      userId: '61460d7354ea082ad0256749',
    });

    // Validate process output
    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create.mock.calls[0]).toMatchSnapshot();

    expect(systemLogRepo.create).toHaveBeenCalledTimes(1);
    expect(systemLogRepo.create.mock.calls[0]).toMatchSnapshot();
  });

  it('should not create duplicated transaction from template with multiple executions', async () => {
    jest
      .spyOn(transactionTemplateRepo, 'findMany')
      .mockResolvedValue(transactionTemplateAllByUserRepoMockData);
    jest.spyOn(transactionTemplateLogRepo, 'findMany').mockResolvedValueOnce([
      {
        eventType: 'AUTO',
        executed: new Date(),
        transactionId: '624befb',
        id: '624befb',
        templateId: '638da86a4ce377d764461255',
        userId: dummyUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(transactionRepo, 'create').mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      transactionsRepoFindAllByIdMockData['624befb66ba655edad8f824e'],
    );

    await service.generateTransactions();

    expect(transactionTemplateRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateRepo.findMany).toHaveBeenCalledWith({
      where: {
        dayOfMonthToCreate: {
          equals: 2,
        },
        templateType: {
          has: 'AUTO',
        },
      },
    });

    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledWith({
      where: {
        eventType: 'AUTO',
        executed: {
          gt: new Date('2022-08-30T21:00:00.000Z'),
        },
        templateId: {
          in: ['638da86a4ce377d764461255'],
        },
      },
    });

    // Validate process output
    expect(transactionRepo.create).toHaveBeenCalledTimes(0);

    expect(systemLogRepo.create).toHaveBeenCalledTimes(1);
    expect(systemLogRepo.create.mock.calls[0]).toMatchSnapshot();
  });

  it('should use last day of month id dayOfMonth is higher than amount of days', async () => {
    dateMock = new Date(2022, 1, 2, 12);

    jest
      .spyOn(transactionTemplateRepo, 'findMany')
      .mockResolvedValueOnce(transactionTemplateAllByUserRepoMockData);
    jest
      .spyOn(transactionTemplateLogRepo, 'findMany')
      .mockResolvedValueOnce([]);
    jest.spyOn(transactionRepo, 'create').mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      transactionsRepoFindAllByIdMockData['624befb66ba655edad8f824e'],
    );

    await service.generateTransactions();

    expect(transactionTemplateRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateRepo.findMany).toHaveBeenCalledWith({
      where: {
        dayOfMonthToCreate: {
          equals: 2,
        },
        templateType: {
          has: 'AUTO',
        },
      },
    });

    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledWith({
      where: {
        eventType: 'AUTO',
        executed: {
          gt: new Date('2022-01-30T22:00:00.000Z'),
        },
        templateId: {
          in: ['638da86a4ce377d764461255'],
        },
      },
    });

    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create).toHaveBeenCalledWith({
      amount: new Decimal('200'),
      date: new Date('2022-02-28T10:00:00.000Z'),
      description: 'Test template 2',
      fromAccount: null,
      toAccount: '61460da354ea082ad025676b',
      userId: '61460d7354ea082ad0256749',
    });

    // Validate process output
    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create.mock.calls[0]).toMatchSnapshot();

    expect(systemLogRepo.create).toHaveBeenCalledTimes(1);
    expect(systemLogRepo.create.mock.calls[0]).toMatchSnapshot();
  });

  it('should create transaction to next month if dayOfMonthToCreate is greater than dayOfMonth', async () => {
    dateMock = new Date(2022, 0, 30, 12);

    jest
      .spyOn(transactionTemplateRepo, 'findMany')
      .mockResolvedValueOnce(transactionTemplateAllByUserRepoMockData);
    jest
      .spyOn(transactionTemplateLogRepo, 'findMany')
      .mockResolvedValueOnce([]);
    jest.spyOn(transactionRepo, 'create').mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      transactionsRepoFindAllByIdMockData['624befb66ba655edad8f824e'],
    );

    await service.generateTransactions();

    expect(transactionTemplateRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateRepo.findMany).toHaveBeenCalledWith({
      where: {
        dayOfMonthToCreate: {
          equals: 30,
        },
        templateType: {
          has: 'AUTO',
        },
      },
    });

    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledWith({
      where: {
        eventType: 'AUTO',
        executed: {
          gt: new Date('2022-01-27T22:00:00.000Z'),
        },
        templateId: {
          in: ['638da86a4ce377d764461255'],
        },
      },
    });

    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create).toHaveBeenCalledWith({
      amount: new Decimal('200'),
      date: new Date('2022-01-31T10:00:00.000Z'),
      description: 'Test template 2',
      fromAccount: null,
      toAccount: '61460da354ea082ad025676b',
      userId: '61460d7354ea082ad0256749',
    });

    // Validate process output
    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create.mock.calls[0]).toMatchSnapshot();

    expect(systemLogRepo.create).toHaveBeenCalledTimes(1);
    expect(systemLogRepo.create.mock.calls[0]).toMatchSnapshot();
  });

  it('should run templates on last day of month even with higher dayOfMonthToCreate values', async () => {
    dateMock = new Date(2022, 1, 28, 12);

    jest
      .spyOn(transactionTemplateRepo, 'findMany')
      .mockResolvedValueOnce(transactionTemplateAllByUserRepoMockData);
    jest
      .spyOn(transactionTemplateLogRepo, 'findMany')
      .mockResolvedValueOnce([]);
    jest.spyOn(transactionRepo, 'create').mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      transactionsRepoFindAllByIdMockData['624befb66ba655edad8f824e'],
    );

    await service.generateTransactions();

    expect(transactionTemplateRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateRepo.findMany).toHaveBeenCalledWith({
      where: {
        dayOfMonthToCreate: {
          gte: 28,
        },
        templateType: {
          has: 'AUTO',
        },
      },
    });

    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionTemplateLogRepo.findMany).toHaveBeenCalledWith({
      where: {
        eventType: 'AUTO',
        executed: {
          gt: new Date('2022-02-25T22:00:00.000Z'),
        },
        templateId: {
          in: ['638da86a4ce377d764461255'],
        },
      },
    });

    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create).toHaveBeenCalledWith({
      amount: new Decimal('200'),
      date: new Date('2022-02-28T10:00:00.000Z'),
      description: 'Test template 2',
      fromAccount: null,
      toAccount: '61460da354ea082ad025676b',
      userId: '61460d7354ea082ad0256749',
    });

    // Validate process output
    expect(transactionRepo.create).toHaveBeenCalledTimes(1);
    expect(transactionRepo.create.mock.calls[0]).toMatchSnapshot();

    expect(systemLogRepo.create).toHaveBeenCalledTimes(1);
    expect(systemLogRepo.create.mock.calls[0]).toMatchSnapshot();
  });
});
