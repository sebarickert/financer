import { NextFunction, Request } from "express";
import supertest from "supertest";
import server from "../../server";
import {
  createAccount,
  findAccountById,
} from "../../services/account-service";
import { IAccountModel } from "../../models/account-model";
import {
  createTransaction,
  findExpenseTransactionsByUser,
  findTransactionById,
} from "../../services/transaction-service";
import { ITransactionModel } from "../../models/transaction-model";

const api = supertest(server);

const SIMPLE_ACCOUNT: IAccount = {
  name: "simple account",
  type: "cash",
  balance: 1000.0,
};

const SIMPLE_TRANSACTION = {
  description: "123",
  amount: 100,
  date: "2020-11-10T00:00:00.000Z",
};

const SIMPLE_TRANSACTION_AFTER = {
  ...SIMPLE_TRANSACTION,
  date: "2020-11-11T00:00:00.000Z",
};

const SIMPLE_TRANSACTION_BEFORE = {
  ...SIMPLE_TRANSACTION,
  date: "2020-11-09T00:00:00.000Z",
};

const USER_ID = "5faef3d6498b721318cbdc51";
const OTHER_USER_ID = "5faef3d6498b721318cbdc55";

jest.mock(
  "../../routes/middlewares/authenticationCheck",
  () => (req: Request, res: never, next: NextFunction) => {
    const user = { _id: USER_ID, id: USER_ID };
    req.user = user;
    next();
  }
);

describe("Expense endpoint", () => {
  test("GET /api/expense should return user own expenses", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 1000,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 900,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      fromAccountBalance: 800,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const { body: expenses }: { body: IExpense[] } = await api
      .get(`/api/expense`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(expenses.length).toEqual(2);
  });

  test("GET /api/expense/EXPENSE-ID should should show only own expenses", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    const ownExpense = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 1000,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const notOwnExpense = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      fromAccountBalance: 800,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    await api
      .get(`/api/expense/${ownExpense?._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .get(`/api/expense/${notOwnExpense?._id}`)
      .expect(403)
      .expect("Content-Type", /application\/json/);
  });

  test("POST /api/expense should add expense and decrease account balance", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 1000,
    } as IAccountModel);

    const {
      body: { payload: newExpense },
    }: { body: IApiResponse<IExpense> } = await api
      .post(`/api/expense`)
      .send({
        ...SIMPLE_TRANSACTION,
        user: USER_ID,
        amount: 100,
        fromAccount: testAccount?._id,
      } as ITransactionModel)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const expenses = await findExpenseTransactionsByUser(USER_ID);
    const testAccountAfter = await findAccountById(testAccount?._id);
    expect(newExpense.fromAccountBalance).toEqual(testAccount?.balance);
    expect(expenses?.length).toEqual(1);
    expect(testAccountAfter?.balance).toEqual(900);
  });

  test("DELETE /api/expense/EXPENSE-ID should remove expense and increase account balance", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 900,
    } as IAccountModel);

    const ownExpense = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 1000,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const notOwnExpense = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: OTHER_USER_ID,
      amount: 100,
      fromAccountBalance: 800,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const expensesBefore = await findExpenseTransactionsByUser(USER_ID);
    expect(expensesBefore?.length).toEqual(1);

    await api
      .delete(`/api/expense/${ownExpense?._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .delete(`/api/expense/${notOwnExpense?._id}`)
      .expect(403)
      .expect("Content-Type", /application\/json/);

    const expensesAfter = await findExpenseTransactionsByUser(USER_ID);
    const testAccountAfter = await findAccountById(testAccount?._id);
    expect(expensesAfter?.length).toEqual(0);
    expect(testAccountAfter?.balance).toEqual(1000);
  });

  test("DELETE /api/expense/EXPENSE-ID should increase newer expense fromAccountBalance", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 800,
    } as IAccountModel);

    const firstTransaction = await createTransaction({
      ...SIMPLE_TRANSACTION,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 1000,
      fromAccount: testAccount?._id,
    } as ITransactionModel);
    const secondTransaction = await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 900,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    await api
      .delete(`/api/expense/${firstTransaction?._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const secondTransactionAfter = await findTransactionById(
      secondTransaction?._id
    );

    expect(secondTransactionAfter?.fromAccountBalance).toEqual(1000);
  });

  test("POST /api/expense when add past expense should decrease newer expense fromAcountBalance", async () => {
    const testAccount = await createAccount({
      ...SIMPLE_ACCOUNT,
      owner: USER_ID,
      balance: 950,
    } as IAccountModel);

    const existingExpenseAfterNewExpense = await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 100,
      fromAccountBalance: 1000,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    const existingExpenseBeforeNewExpense = await createTransaction({
      ...SIMPLE_TRANSACTION_BEFORE,
      user: USER_ID,
      amount: 500,
      fromAccountBalance: 1500,
      fromAccount: testAccount?._id,
    } as ITransactionModel);

    await createTransaction({
      ...SIMPLE_TRANSACTION_AFTER,
      user: USER_ID,
      amount: 50,
      toAccountBalance: 900,
      toAccount: testAccount?._id,
    } as ITransactionModel);

    const {
      body: { payload: newExpense },
    } = await api
      .post(`/api/expense`)
      .send({
        ...SIMPLE_TRANSACTION,
        user: USER_ID,
        amount: 100,
        fromAccount: testAccount?._id,
      } as ITransactionModel)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const existingIncomeAfterNewExpenseAfterInsertNewExpense = await findTransactionById(
      existingExpenseAfterNewExpense?._id
    );
    const existingIncomeBeforeNewExpenseAfterInsertNewExpense = await findTransactionById(
      existingExpenseBeforeNewExpense?._id
    );
    expect(
      existingIncomeAfterNewExpenseAfterInsertNewExpense?.fromAccountBalance
    ).toEqual(900);
    expect(
      existingIncomeBeforeNewExpenseAfterInsertNewExpense?.fromAccountBalance
    ).toEqual(1500);
    expect(newExpense?.fromAccountBalance).toEqual(1000);
  });
});
