import { NextFunction, Request } from 'express';
import supertest from 'supertest';

import { IAccountModel } from '../../models/account-model';
import { ITransactionModel } from '../../models/transaction-model';
import { createExpressServer } from '../../server';
import { createAccount, findAccountById } from '../../services/account-service';
import {
  createTransaction,
  findIncomeTransactionsByUser,
  findTransactionById,
} from '../../services/transaction-service';

const SIMPLE_ACCOUNT: IAccount = {
  name: 'simple account',
  type: 'cash',
  balance: 1000.0,
};

const SIMPLE_TRANSACTION = {
  description: '123',
  amount: 100,
  date: '2020-11-10T00:00:00.000Z',
};

const SIMPLE_TRANSACTION_AFTER = {
  ...SIMPLE_TRANSACTION,
  date: '2020-11-11T00:00:00.000Z',
};

const SIMPLE_TRANSACTION_BEFORE = {
  ...SIMPLE_TRANSACTION,
  date: '2020-11-09T00:00:00.000Z',
};

const USER_ID = '5faef3d6498b721318cbdc51';
const OTHER_USER_ID = '5faef3d6498b721318cbdc55';

jest.mock(
  '../../routes/middlewares/authenticationCheck',
  () => (req: Request, res: never, next: NextFunction) => {
    const user = { _id: USER_ID, id: USER_ID };
    req.user = user;
    next();
  }
);

describe('Income endpoint', () => {
  let api: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    api = supertest(createExpressServer());
  });

  test('GET /api/income should return user own incomes', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 1000,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 1100,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      toAccountBalance: 1200,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const { body: incomes }: { body: IIncome[] } = await api
      .get(`/api/income`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(incomes.length).toEqual(2);
  });

  test('GET /api/income/INCOME-ID should should show only own incomes', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    const ownIncome = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 1000,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const notOwnIncome = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      toAccountBalance: 1100,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    await api
      .get(`/api/income/${ownIncome?._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    await api
      .get(`/api/income/${notOwnIncome?._id}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);
  });

  test('POST /api/income should add income and increase account balance', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    const {
      body: { payload: newIncome },
    }: { body: IApiResponse<IIncome> } = await api
      .post(`/api/income`)
      .send({
        ...SIMPLE_TRANSACTION,
        user: USER_ID,
        amount: 100,
        toAccount: testAccount?._id,
      } as ITransactionModel)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const incomes = await findIncomeTransactionsByUser(USER_ID);
    const testAccountAfter = await findAccountById(testAccount?._id);
    expect(newIncome.toAccountBalance).toEqual(testAccount?.balance);
    expect(incomes?.length).toEqual(1);
    expect(testAccountAfter?.balance).toEqual(1100);
  });

  test('DELETE /api/income/INCOME-ID should remove own income and decrease account balance', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 900,
    } as IAccountModel);

    const ownIncome = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 1000,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const notOwnIncome = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      toAccountBalance: 800,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const incomesBefore = await findIncomeTransactionsByUser(USER_ID);
    expect(incomesBefore?.length).toEqual(1);

    await api
      .delete(`/api/income/${ownIncome?._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    await api
      .delete(`/api/income/${notOwnIncome?._id}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    const incomesAfter = await findIncomeTransactionsByUser(USER_ID);
    const testAccountAfter = await findAccountById(testAccount?._id);
    expect(incomesAfter?.length).toEqual(0);
    expect(testAccountAfter?.balance).toEqual(800);
  });

  test('DELETE /api/income/INCOME-ID should decrease newer income toAccountBalance', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    const firstTransaction = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 800,
      toAccount: testAccount?._id,
    } as ITransactionModel);
    const secondTransaction = await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 900,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    await api
      .delete(`/api/income/${firstTransaction?._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const secondTransactionAfter = await findTransactionById(
      secondTransaction?._id
    );

    expect(secondTransactionAfter?.toAccountBalance).toEqual(800);
  });

  test('POST /api/income when add past expense should decrease newer income fromAcountBalance', async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1050,
    } as IAccountModel);

    const existingIncomeBeforeNewExpense = await createTransaction({
      ...SIMPLE_TRANSACTION_BEFORE,
      user: USER_ID,
      amount: 500,
      toAccountBalance: 500,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const existingIncomeAfterNewExpense = await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 100,
      toAccountBalance: 1000,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 50,
      fromAccountBalance: 1100,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const {
      body: { payload: newIncome },
    } = await api
      .post(`/api/income`)
      .send({
        ...SIMPLE_TRANSACTION,
        user: USER_ID,
        amount: 100,
        toAccount: testAccount?._id,
      } as ITransactionModel)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const existingIncomeAfterNewExpenseAfterInsertNewIncome =
      await findTransactionById(existingIncomeAfterNewExpense?._id);
    const existingIncomeBeforeNewExpenseAfterInsertNewIncome =
      await findTransactionById(existingIncomeBeforeNewExpense?._id);
    expect(
      existingIncomeAfterNewExpenseAfterInsertNewIncome?.toAccountBalance
    ).toEqual(1100);
    expect(
      existingIncomeBeforeNewExpenseAfterInsertNewIncome?.toAccountBalance
    ).toEqual(500);
    expect(newIncome?.toAccountBalance).toEqual(1000);
  });
});
