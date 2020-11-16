import { Response, Request } from "express";
import { ITransactionModel } from "../models/transaction-model";

import { IUserModel } from "../models/user-model";
import { findAccountsById } from "../services/account-service";
import {
  createTransaction,
  findExpenseTransactionsByUser,
} from "../services/transaction-service";

export const listUserExpenses = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const allIncomes = await findExpenseTransactionsByUser(user.id);
  res.status(200).json(allIncomes);
};

export const addExpense = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const rawNewExpense = req.body as ITransactionModel;

  const errors: string[] = [];

  if (
    !("amount" in rawNewExpense) ||
    typeof rawNewExpense.amount !== "number"
  ) {
    errors.push("Amount must be a number.");
  }
  if (new Date(rawNewExpense.date).toDateString() === "Invalid Date") {
    errors.push("Date must not be empty.");
  }

  let sourceAccount;
  if (
    !("fromAccount" in rawNewExpense) ||
    typeof rawNewExpense.fromAccount === "undefined" ||
    rawNewExpense.fromAccount?.length === 0
  ) {
    errors.push("fromAccount must not be empty.");
  } else {
    sourceAccount = await findAccountsById(rawNewExpense.fromAccount);
    if (sourceAccount === null) {
      errors.push("Source account not found.");
    } else if (`${sourceAccount?.owner}` !== `${user.id}`) {
      errors.push("You can add expenses only to your own accounts.");
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ authorized: true, status: 400, errors });
    return;
  }

  rawNewExpense.user = user.id;
  rawNewExpense.fromAccountBalance = sourceAccount?.balance;

  if (sourceAccount) {
    sourceAccount.balance -= rawNewExpense.amount;
    await sourceAccount.save();
  }

  const newTransaction = await createTransaction(rawNewExpense);

  res
    .status(201)
    .json({ authorized: true, status: 201, payload: newTransaction });
};
