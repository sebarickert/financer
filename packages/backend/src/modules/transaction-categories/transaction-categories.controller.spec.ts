import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { setupTestNestApp } from '../../setup-test-nest-app';

import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';

describe('TransactionCategoriesController', () => {
  let app: INestApplication;
  let service: TransactionCategoriesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionCategoriesController],
      providers: [createMockServiceProvider(TransactionCategoriesService)],
    }).compile();

    service = module.get<TransactionCategoriesService>(
      TransactionCategoriesService,
    );
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

  describe('/POST create transaction category', () => {
    it('/POST create transaction category with empty name', async () => {
      const categoryPayload = {
        name: '',
        visibility: 'INCOME',
        parent_category_id: '',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/transaction-categories')
        .send(categoryPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Name must not be empty.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toBeCalled();
        });
    });

    it('/POST create transaction category with invalid visibility', async () => {
      const categoryPayload = {
        name: 'test',
        visibility: 'NOT-A-VALID-VISIBILITY',
        parent_category_id: '',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/transaction-categories')
        .send(categoryPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Visibility must be one of the following: INCOME, EXPENSE, TRANSFER.',
          ],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toBeCalled();
        });
    });

    it('/POST create transaction category with valid visibility', async () => {
      const categoryPayload = {
        name: 'test',
        visibility: ['INCOME', 'EXPENSE', 'TRANSFER'],
        parent_category_id: '',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/transaction-categories')
        .send(categoryPayload)
        .expect(201)
        .expect({})
        .then(() => {
          expect(service.create).toBeCalled();
        });
    });

    it('/POST create transaction category with empty payload', async () => {
      const categoryPayload = {};
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/transaction-categories')
        .send(categoryPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Name must not be empty.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toBeCalled();
        });
    });
  });
});
