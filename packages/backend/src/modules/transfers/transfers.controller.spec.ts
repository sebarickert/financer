import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { setupTestNestApp } from '../../setup-test-nest-app';
import { TransactionsService } from '../transactions/transactions.service';

import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

describe('TransfersController', () => {
  let app: INestApplication;
  let controller: TransfersController;
  let service: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        createMockServiceProvider(TransactionsService),
      ],
      controllers: [TransfersController],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    controller = module.get<TransfersController>(TransfersController);
    app = module.createNestApplication();
    setupTestNestApp(app);
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Check create transfer validations', async () => {
    const createMock = jest
      .spyOn(service, 'create')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation(() => Promise.resolve({} as any));

    await supertest(app.getHttpServer())
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(201);
    expect(createMock).toHaveBeenCalledTimes(1);
    createMock.mockReset();

    await supertest(app.getHttpServer())
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '',
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
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
      .post('/api/transfers')
      .send({
        fromAccount: '5fb42f145712ea336a98ef21',
        toAccount: '5fb42f145712ea336a98ef21',
        amount: 10,
        description: 'test',
        date: '2023-03-03T19:54:00.000Z',
        categories: [],
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ["Target and source accounts can't be the same account."],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();

    await supertest(app.getHttpServer())
      .post('/api/transfers')
      .send({})
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'fromAccount must not be empty.',
          "Target and source accounts can't be the same account.",
          'Amount must be a decimal number.',
          'Amount must be a positive number.',
          'description must be a string',
          'Description must not be empty.',
          'Date must not be empty.',
          'toAccount must not be empty.',
        ],
        error: 'Bad Request',
      });
    expect(createMock).not.toHaveBeenCalled();
  });
});

// Verify Transfer accounts
// Verify Transfer account cannot be empty
// Verify Transfer toAccount must exists
// Verify Transfer fromAccounts must exists
// Verify Transfer target and source account cannot be the same account
// Test with empty form
