import { Response, Request } from "express";

import { ACCOUNT_TYPES, IAccountModel } from "../models/account-model";
import { IUserModel } from "../models/user-model";
import {
  createAccount,
  findAccountsById,
  findAccountsByUser,
} from "../services/account-service";
import { findTransactionsByAccount } from "../services/transaction-service";

export const listAccounts = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const allAccounts = await findAccountsByUser(user.id);
  res.status(200).json(allAccounts);
};

export const getAccount = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const accountId = req.params.id;
  const account = await findAccountsById(accountId);

  if (account === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Account not found."],
    });
    return;
  }
  if (`${account?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that account."],
    });
    return;
  }
  res.status(200).json({ authenticated: true, status: 200, payload: account });
};

export const addAccount = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const newAccountData = req.body as IAccountModel;

  const errors: string[] = [];

  if (!("name" in newAccountData) || newAccountData.name.length === 0) {
    errors.push("Name must not be empty.");
  }

  if (
    !("type" in newAccountData) ||
    !ACCOUNT_TYPES.includes(newAccountData.type)
  ) {
    errors.push(
      `Type must be one of the following: ${ACCOUNT_TYPES.join(", ")}.`
    );
  }

  if (
    !("balance" in newAccountData) ||
    typeof newAccountData.balance !== "number"
  ) {
    errors.push("Balance must be a number.");
  }

  if (errors.length > 0) {
    res.status(400).json({ authorized: true, status: 400, errors });
    return;
  }
  newAccountData.owner = user.id;
  const newAccount = await createAccount(newAccountData);

  res.status(201).json({ authorized: true, status: 201, payload: newAccount });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const accountId = req.params.id;
  const account = await findAccountsById(accountId);

  if (account === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Account not found."],
    });
    return;
  }
  if (`${account?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["You can delete only your own accounts."],
    });
    return;
  }

  await account.remove();

  res.status(200).json({ authenticated: true, status: 200 });
};

export const updateAccount = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const accountId = req.params.id;
  const modifiedAccountData = req.body as IAccountModel;

  const account = await findAccountsById(accountId);

  if (`${account?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["You can delete only your own accounts."],
    });
    return;
  }
  if (account === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Account not found."],
    });
    return;
  }

  if ("name" in modifiedAccountData) {
    account.name = modifiedAccountData.name;
  }
  if ("balance" in modifiedAccountData) {
    account.balance = modifiedAccountData.balance;
  }
  if ("type" in modifiedAccountData) {
    account.type = modifiedAccountData.type;
  }

  await account?.save();

  res.status(200).json({ authenticated: true, status: 200 });
};

export const getAllAccountTransactions = async (
  req: Request,
  res: Response
) => {
  const user = req.user as IUserModel;
  const accountId = req.params.id;
  const account = await findAccountsById(accountId);

  if (account === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Account not found."],
    });
    return;
  }
  if (`${account?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that account."],
    });
    return;
  }
  const transactions = await findTransactionsByAccount(accountId);
  res
    .status(200)
    .json({ authenticated: true, status: 200, payload: transactions });
};
