import { Response, Request } from "express";

import { ACCOUNT_TYPES, IAccountModel } from "../models/account-model";
import { IUserModel } from "../models/user-model";
import {
  createNewAccount,
  findAccountsById,
  findAccountsByUser,
} from "../services/account-service";

export const listAccounts = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const allAccounts = await findAccountsByUser(user.id);
  res.status(200).json(allAccounts);
};

export const getAccount = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const accountId = req.params.id;
  const account = await findAccountsById(accountId);

  if (account?.owner + "" !== user._id + "") {
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
    errors.push("New account name can't be empty");
  }
  if (
    !("type" in newAccountData) ||
    !ACCOUNT_TYPES.includes(newAccountData.type)
  ) {
    errors.push(`New account type must be one of ${ACCOUNT_TYPES.join(", ")}`);
  }
  if (
    !("type" in newAccountData) ||
    typeof newAccountData.balance !== "number"
  ) {
    newAccountData.balance = 0;
  }

  if (errors.length > 0) {
    res.status(400).json({ status: 400, errors });
    return;
  }
  newAccountData.owner = user.id;
  const newAccount = await createNewAccount(newAccountData);

  res.status(201).json(newAccount);
};
