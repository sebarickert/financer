import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { setupTestNestApp } from '../../setup-test-nest-app';

import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

describe('ExpensesController', () => {
  let app: INestApplication;
  let service: ExpensesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [createMockServiceProvider(ExpensesService)],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    app = module.createNestApplication();
    setupTestNestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('/POST create expense', () => {
    it('Check create expense with empty description', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 19,
        description: '',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Description must not be empty.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with missing amount', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Amount must be a positive number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with invalid amount', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 'not-a-number',
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Amount must be a positive number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with valid data', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(201)
        .then(() => {
          expect(service.create).toHaveBeenCalledTimes(1);
        });
    });

    it('Check create expense with zero amount', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: 0,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Amount must be a positive number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with negative amount', async () => {
      const expensePayload = {
        fromAccount: '5fb42f145712ea336a98ef20',
        amount: -10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Amount must be a positive number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with empty fromAccount', async () => {
      const expensePayload = {
        fromAccount: '',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['fromAccount must not be empty.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('Check create expense with empty payload', async () => {
      const expensePayload = {};
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      await supertest(app.getHttpServer())
        .post('/api/expenses')
        .send(expensePayload)
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
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });
  });
});
