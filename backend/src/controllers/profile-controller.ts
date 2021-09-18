import { Response, Request } from "express";
import { IAccountModel } from "../models/account-model";
import { ITransactionCategoryMappingModel } from "../models/transaction-category-mapping-model";
import { ITransactionCategoryModel } from "../models/transaction-category-model";
import { ITransactionModel } from "../models/transaction-model";
import { IUserModel } from "../models/user-model";
import {
  createAccount,
  DANGER_truncateAccountByUser,
  findAccountsByUser,
} from "../services/account-service";
import {
  createTransactionCategoryMapping,
  DANGER_truncateTransactionCategoryMappingsByUser,
  findTransactionCategoryMappingsByUser,
} from "../services/transaction-category-mapping-service";
import {
  createTransactionCategory,
  DANGER_truncateTransactionCategoriesByUser,
  findTransactionCategoriesByUser,
} from "../services/transaction-category-service";
import {
  createTransaction,
  DANGER_truncateTransactionsByUser,
  findTransactionsByUser,
} from "../services/transaction-service";

export const getMyData = async (req: Request, res: Response): Promise<void> => {
  const getMyDataFilename = (): string => {
    const addLeadingZero = (number: number): string => `0${number}`.substr(-2);

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `my-financer-data-${year}${addLeadingZero(month)}${addLeadingZero(
      day
    )}.json`;
  };
  const user = req.user as IUserModel;
  const accounts = await findAccountsByUser(user.id);
  const transactions = await findTransactionsByUser(user.id);
  const transactionCategories = await findTransactionCategoriesByUser(user.id);
  const transactionCategoryMappings =
    await findTransactionCategoryMappingsByUser(user.id);

  const data = JSON.stringify({
    user,
    accounts,
    transactions,
    transactionCategories,
    transactionCategoryMappings,
  });

  res.setHeader(
    "Content-disposition",
    `attachment; filename= ${getMyDataFilename()}`
  );
  res.setHeader("Content-type", "application/json");

  res.write(data, () => {
    res.end();
  });
};

export const overrideMyData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;

  if (!user.roles.includes("test-user")) {
    res.status(403).json({
      status: 403,
      errors: ["Only users with the test-user role can override account data."],
    });
    return;
  }

  await DANGER_truncateAccountByUser(user.id);
  await DANGER_truncateTransactionsByUser(user.id);
  await DANGER_truncateTransactionCategoriesByUser(user.id);
  await DANGER_truncateTransactionCategoryMappingsByUser(user.id);

  const {
    accounts,
    transactions,
    transactionCategories,
    transactionCategoryMappings,
  }: {
    accounts: IAccountModel[];
    transactions: ITransactionModel[];
    transactionCategories: ITransactionCategoryModel[];
    transactionCategoryMappings: ITransactionCategoryMappingModel[];
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const migrateTransactionCategories: any[] = transactionCategories.map(
    (transactionCategory) => ({
      ...transactionCategory,
      owner: user.id,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const migrateTransactionCategoryMappings: any[] =
    transactionCategoryMappings.map((transactionCategoryMapping) => ({
      ...transactionCategoryMapping,
      owner: user.id,
    }));

  await Promise.all(
    migrateAccounts.map(async (account) => createAccount(account))
  );
  await Promise.all(
    migrateTransactions.map(async (transaction) =>
      createTransaction(transaction)
    )
  );
  await Promise.all(
    migrateTransactionCategories.map((transactionCategory) =>
      createTransactionCategory(transactionCategory)
    )
  );
  await Promise.all(
    migrateTransactionCategoryMappings.map((migrateTranactionCategoryMapping) =>
      createTransactionCategoryMapping(migrateTranactionCategoryMapping)
    )
  );

  res
    .status(201)
    .json({ status: 201, payload: "Successfully overrided data." });
};
