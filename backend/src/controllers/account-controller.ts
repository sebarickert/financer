import { Response, Request } from "express";

import { ACCOUNT_TYPES, IAccountModel } from "../models/account-model";
import { IUserModel } from "../models/user-model";
import {
  createNewAccount,
  findAccountsByUser,
} from "../services/account-service";

export const listAccounts = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const allAccounts = await findAccountsByUser(user.id);
  res.status(200).json(allAccounts);
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
