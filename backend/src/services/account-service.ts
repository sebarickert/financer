import accountModel, { IAccountModel } from "../models/account-model";

export const findAccountsByUser = async (
  userId: string
): Promise<IAccountModel[] | null> => accountModel.find({ owner: userId });

export const findAccountsById = async (
  id: string
): Promise<IAccountModel | null> => accountModel.findById(id);

export const createAccount = async (
  newAccount: IAccountModel
): Promise<IAccountModel | null> => accountModel.create(newAccount);
