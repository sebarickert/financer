import accountModel, { IAccountModel } from "../models/account-model";

export const findAccountsByUser = async (userId: string) =>
  accountModel.find({ owner: userId });

export const createNewAccount = async (newAccount: IAccountModel) =>
  accountModel.create(newAccount);
