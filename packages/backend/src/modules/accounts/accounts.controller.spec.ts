import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { setupTestNestApp } from '../../setup-test-nest-app';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let app: INestApplication;
  let service: AccountsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [createMockServiceProvider(AccountsService)],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
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

  describe('/POST create account', () => {
    it('/POST create account with empty name', async () => {
      const accountPayload = {
        name: '',
        type: 'CASH',
        balance: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Name must not be empty.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('/POST create account with missing balance', async () => {
      const accountPayload = {
        name: 'test',
        type: 'CASH',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Balance must be a number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('/POST create account with empty balance', async () => {
      const accountPayload = {
        name: 'test',
        type: 'CASH',
        balance: '',
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Balance must be a number.'],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('/POST create account with positive balance', async () => {
      const accountPayload = {
        name: 'test',
        type: 'CASH',
        balance: 10,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(201)
        .expect({})
        .then(() => {
          expect(service.create).toHaveBeenCalled();
        });
    });

    it('/POST create account with negative balance', async () => {
      const accountPayload = {
        name: 'test',
        type: 'CASH',
        balance: -10,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(201)
        .expect({})
        .then(() => {
          expect(service.create).toHaveBeenCalled();
        });
    });

    it('/POST create account with zero balance', async () => {
      const accountPayload = {
        name: 'test',
        type: 'CASH',
        balance: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(201)
        .expect({})
        .then(() => {
          expect(service.create).toHaveBeenCalled();
        });
    });

    it('/POST create account with missing type', async () => {
      const accountPayload = {
        name: 'test',
        balance: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Type must be one of the following: CASH, SAVINGS, INVESTMENT, CREDIT, LOAN, LONG_TERM_SAVINGS, PRE_ASSIGNED_CASH.',
          ],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('/POST create account with invalid type', async () => {
      const accountPayload = {
        name: 'test',
        type: 'FAKE-account-type',
        balance: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Type must be one of the following: CASH, SAVINGS, INVESTMENT, CREDIT, LOAN, LONG_TERM_SAVINGS, PRE_ASSIGNED_CASH.',
          ],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });

    it('/POST create account with empty payload', async () => {
      const accountPayload = {};
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name must be a string',
            'Name must not be empty.',
            'Type must be one of the following: CASH, SAVINGS, INVESTMENT, CREDIT, LOAN, LONG_TERM_SAVINGS, PRE_ASSIGNED_CASH.',
            'Balance must be a number.',
          ],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });
  });
});
