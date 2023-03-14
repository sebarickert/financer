import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { setupTestNestApp } from '../../setup-test-nest-app';
import { TransactionsModule } from '../transactions/transactions.module';

import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

describe('ExpensesController', () => {
  let app: INestApplication;
  let controller: ExpensesController;
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), TransactionsModule],
      providers: [ExpensesService],
      controllers: [ExpensesController],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    controller = module.get<ExpensesController>(ExpensesController);
    app = module.createNestApplication();
    setupTestNestApp(app);
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Check create expense validations', async () => {
    const createMock = jest
      .spyOn(service, 'create')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation(() => Promise.resolve({} as any));

    await supertest(app.getHttpServer())
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 'not-a-number',
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
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(201);
    expect(createMock).toHaveBeenCalledTimes(1);
    createMock.mockReset();

    await supertest(app.getHttpServer())
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/expenses')
      .send({
        fromAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/expenses')
      .send({
        fromAccount: '',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['fromAccount must not be empty.'],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/expenses')
      .send({})
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Amount must be a positive number.',
          'description must be a string',
          'Description must not be empty.',
          'Date must not be empty.',
          'fromAccount must not be empty.',
        ],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();
  });
});
