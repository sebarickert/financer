import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

import { setupTestNestApp } from '@/setup-test-nest-app';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';
import { TransactionsService } from '@/transactions/transactions.service';

const mockToAccountId = '8941f57e-84e9-4ac2-a5de-1bd944ec3568';

describe('IncomesController', () => {
  let app: NestExpressApplication;
  let controller: IncomesController;
  let service: IncomesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomesService,
        createMockServiceProvider(TransactionsService),
      ],
      controllers: [IncomesController],
    }).compile();

    service = module.get<IncomesService>(IncomesService);
    controller = module.get<IncomesController>(IncomesController);
    app = module.createNestApplication();
    setupTestNestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Check create income validations', async () => {
    const createMock = jest
      .spyOn(service, 'create')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation(() => Promise.resolve({} as any));

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        amount: 19,
        description: '',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['Description must not be empty.'],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Amount must be a decimal number.',
          'Amount must be a positive number.',
        ],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        amount: 'not-a-number',
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Amount must be a decimal number.',
          'Amount must be a positive number.',
        ],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(201);
    expect(createMock).toHaveBeenCalledTimes(1);
    createMock.mockReset();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        amount: 0,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['Amount must be a positive number.'],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: mockToAccountId,
        amount: -10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['Amount must be a positive number.'],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({
        toAccount: '',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['toAccount must not be empty.'],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/incomes')
      .send({})
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Amount must be a decimal number.',
          'Amount must be a positive number.',
          'description must be a string',
          'Description must not be empty.',
          'Date must not be empty.',
        ],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();
  });
});
