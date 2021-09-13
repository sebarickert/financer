import accountModel, { IAccountModel } from "../models/account-model";

export const findAccountsByUser = async (
  userId: string
): Promise<IAccountModel[] | null> => accountModel.find({ owner: userId });

export const findAccountById = async (
  id: string
): Promise<IAccountModel | null> => accountModel.findById(id);

export const createAccount = async (
  newAccount: IAccountModel
): Promise<IAccountModel | null> => accountModel.create(newAccount);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DANGER_truncateAccountByUser = async (
  userId: string
): Promise<void> => {
  await accountModel.deleteMany({ owner: userId });
};
