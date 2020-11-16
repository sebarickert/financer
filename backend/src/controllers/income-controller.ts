import { Response, Request } from "express";
import { ITransactionModel } from "../models/transaction-model";

import { IUserModel } from "../models/user-model";
import { findAccountsById } from "../services/account-service";
import {
  createTransaction,
  findIncomeTransactionsByUser,
} from "../services/transaction-service";

export const listUserIncomes = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const allIncomes = await findIncomeTransactionsByUser(user.id);
  res.status(200).json(allIncomes);
};

export const addIncome = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const rawNewIncome = req.body as ITransactionModel;

  const errors: string[] = [];

  if (!("amount" in rawNewIncome) || typeof rawNewIncome.amount !== "number") {
    errors.push("Amount must be a number.");
  }
  if (new Date(rawNewIncome.date).toDateString() === "Invalid Date") {
    errors.push("Date must not be empty.");
  }

  let targetAccount;
  if (
    !("toAccount" in rawNewIncome) ||
    typeof rawNewIncome.toAccount === "undefined" ||
    rawNewIncome.toAccount?.length === 0
  ) {
    errors.push("toAccount must not be empty.");
  } else {
    targetAccount = await findAccountsById(rawNewIncome.toAccount);
    if (targetAccount === null) {
      errors.push("Target account not found.");
    } else if (`${targetAccount?.owner}` !== `${user.id}`) {
      errors.push("You can add incomes only to your own accounts.");
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ authorized: true, status: 400, errors });
    return;
  }

  rawNewIncome.user = user.id;
  rawNewIncome.toAccountBalance = targetAccount?.balance;

  if (targetAccount) {
    targetAccount.balance += rawNewIncome.amount;
    await targetAccount.save();
  }

  const newTransaction = await createTransaction(rawNewIncome);

  res
    .status(201)
    .json({ authorized: true, status: 201, payload: newTransaction });
};
