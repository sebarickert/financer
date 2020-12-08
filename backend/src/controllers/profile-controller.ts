import { Response, Request } from "express";
import { IAccountModel } from "../models/account-model";
import { ITransactionModel } from "../models/transaction-model";
import { IUserModel } from "../models/user-model";
import {
  createAccount,
  DANGER_truncateAccountByUser,
  findAccountsByUser,
} from "../services/account-service";
import {
  createTransaction,
  DANGER_truncateTransactionsByUser,
  findTransactionsByUser,
} from "../services/transaction-service";

export const getMyData = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const accounts = await findAccountsByUser(user.id);
  const transactions = await findTransactionsByUser(user.id);
  const data = JSON.stringify({ user, accounts, transactions });

  res.setHeader("Content-disposition", "attachment; filename= myData.json");
  res.setHeader("Content-type", "application/json");

  res.write(data, () => {
    res.end();
  });
};

export const overrideMyData = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;

  if (!user.role.includes("test-user")) {
    res.status(403).json({
      status: 403,
      errors: ["Only users with the test-user role can override account data."],
    });
    return;
  }

  await DANGER_truncateAccountByUser(user.id);
  await DANGER_truncateTransactionsByUser(user.id);

  const {
    accounts,
    transactions,
  }: {
    accounts: IAccountModel[];
    transactions: ITransactionModel[];
  } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const migrateAccounts: any[] = accounts.map((account) => ({
    ...account,
    owner: user.id,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const migrateTransactions: any[] = transactions.map((transaction) => ({
    ...transaction,
    user: user.id,
  }));

  migrateAccounts.forEach(async (account) => createAccount(account));
  migrateTransactions.forEach(async (transaction) =>
    createTransaction(transaction)
  );

  res
    .status(201)
    .json({ status: 201, payload: "Successfully overrided data." });
};
