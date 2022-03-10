import { NextFunction, Request } from 'express';
import supertest from 'supertest';

import { IAccountModel } from '../../models/account-model';
import { createExpressServer } from '../../server';
import { createAccount } from '../../services/account-service';

const SIMPLE_ACCOUNT: IAccount = {
  _id: '5faef3d6498b721318cbdc3e',
  name: 'simple account',
  type: 'cash',
  balance: 1000.0,
};

const USER_ID = '5faef3d6498b721318cbdc51';
const OTHER_USER_ID = '5faef3d6498b721318cbdc55';

jest.mock('../../routes/middlewares/authenticationCheck', () => ({
  authenticationCheck: (req: Request, res: never, next: NextFunction) => {
    const user = { _id: USER_ID, id: USER_ID };
    req.user = user;
    next();
  },
}));

describe('Account endpoint', () => {
  let api: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    api = supertest(createExpressServer());
  });

  test('GET /api/account should return all user own accounts', async () => {
    const accountData = { ...SIMPLE_ACCOUNT } as IAccountModel;
    delete accountData._id;
    accountData.owner = USER_ID;

    await createAccount(accountData);
    await createAccount(accountData);
    await createAccount(accountData);
    accountData.owner = OTHER_USER_ID;
    await createAccount(accountData);

    const accounts = await api
      .get('/api/account')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(accounts.body.length).toEqual(3);
  });

  test('DELETE /api/account/ACCOUNT-ID should delete account if user own that account', async () => {
    const accountData = { ...SIMPLE_ACCOUNT } as IAccountModel;
    delete accountData._id;
    accountData.owner = USER_ID;
    const ownAccount = await createAccount(accountData);
    accountData.owner = OTHER_USER_ID;
    const notOwnAccount = await createAccount(accountData);

    await api
      .delete(`/api/account/${ownAccount?._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    await api
      .delete(`/api/account/${notOwnAccount?._id}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);
  });
});
