import accountModel, { IAccountModel } from "../models/account-model";

export const findAccountsByUser = async (userId: string) =>
  accountModel.find({ owner: userId });

export const findAccountsById = async (id: string) => accountModel.findById(id);

export const createAccount = async (newAccount: IAccountModel) =>
  accountModel.create(newAccount);
