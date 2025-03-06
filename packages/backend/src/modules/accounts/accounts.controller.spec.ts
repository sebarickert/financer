import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';
import supertest from 'supertest';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

import { setupTestNestApp } from '@/setup-test-nest-app';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('AccountsController', () => {
  let app: NestExpressApplication;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Balance must be a decimal number, with 2 decimals.'],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .post('/api/accounts')
        .send(accountPayload)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Balance must be a decimal number, with 2 decimals.'],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            'Balance must be a decimal number, with 2 decimals.',
          ],
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.create).not.toHaveBeenCalled();
        });
    });
  });

  describe('/GET get accounts', () => {
    it('/GET get accounts with valid accountTypes', async () => {
      jest
        .spyOn(service, 'findAllByUser')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .get('/api/accounts')
        .query({ accountTypes: [AccountType.SAVINGS] })
        .expect(200)
        .then(() => {
          expect(service.findAllByUser).toHaveBeenCalled();
        });
    });

    it('/GET get accounts with invalid accountTypes', async () => {
      jest
        .spyOn(service, 'findAllByUser')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation(() => Promise.resolve({} as any));

      return supertest(app.getHttpServer())
        .get('/api/accounts')
        .query({ accountTypes: ['notValid'] })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Invalid enum value provided!',
          error: 'Bad Request',
        })
        .then(() => {
          expect(service.findAllByUser).not.toHaveBeenCalled();
        });
    });
  });
});
