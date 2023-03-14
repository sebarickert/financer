import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { setupTestNestApp } from '../../setup-test-nest-app';
import { TransactionsModule } from '../transactions/transactions.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

describe('IncomesController', () => {
  let app: INestApplication;
  let controller: IncomesController;
  let service: IncomesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), TransactionsModule],
      providers: [IncomesService],
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
      .post('/api/incomes')
      .send({
        toAccount: '5fb42f145712ea336a98ef20',
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
        toAccount: '5fb42f145712ea336a98ef20',
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
      .post('/api/incomes')
      .send({
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
      .post('/api/incomes')
      .send({
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
      .post('/api/incomes')
      .send({
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
