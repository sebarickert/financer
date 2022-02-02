import { Response, Request, NextFunction } from "express";
import { ITransactionModel } from "../models/transaction-model";

import { IUserModel } from "../models/user-model";
import { findAccountById } from "../services/account-service";
import { findExpenseTransactionsByUser } from "../services/transaction-service";

export const listUserExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const allIncomes = await findExpenseTransactionsByUser(user.id);
  res.status(200).json(allIncomes);
};

export const verifyNewExpenseInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user as IUserModel;
  const rawNewExpense = req.body as ITransactionModel;

  const errors: string[] = [];

  if (
    !("amount" in rawNewExpense) ||
    typeof rawNewExpense.amount !== "number"
  ) {
    errors.push("Amount must be a number.");
  }
  if (
    new Date(rawNewExpense.date).toDateString() === "Invalid Date" ||
    rawNewExpense.date === null
  ) {
    errors.push("Date must not be empty.");
  }

  let sourceAccount;
  if (
    !("fromAccount" in rawNewExpense) ||
    !rawNewExpense.fromAccount ||
    rawNewExpense.fromAccount?.length === 0
  ) {
    errors.push("fromAccount must not be empty.");
  } else {
    sourceAccount = await findAccountById(rawNewExpense.fromAccount);
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

  next();
};
