import transactionModel, {
  ITransactionModel,
} from "../models/transaction-model";

export const findIncomeTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
    toAccount: { $ne: undefined },
    fromAccount: { $eq: undefined },
  });

export const findExpenseTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
    fromAccount: { $ne: undefined },
    toAccount: { $eq: undefined },
  });

export const findTransactionById = async (
  id: string
): Promise<ITransactionModel | null> => transactionModel.findById(id);

export const createTransaction = async (
  newAccount: ITransactionModel
): Promise<ITransactionModel | null> => transactionModel.create(newAccount);

export const findTransferTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
    fromAccount: { $ne: undefined },
    toAccount: { $ne: undefined },
  });

export const findTransactionsByAccount = async (
  accountId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    $or: [
      {
        fromAccount: accountId,
      },
      {
        toAccount: accountId,
      },
    ],
  });

export const findTransactionsAfterByAccount = async (
  accountId: string,
  date: Date
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    date: { $gt: date },
    $or: [
      {
        fromAccount: accountId,
      },
      {
        toAccount: accountId,
      },
    ],
  });

export const findTransactionsByUser = async (
  userId: string
): Promise<ITransactionModel[] | null> =>
  transactionModel.find({
    user: userId,
  });

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DANGER_truncateTransactionsByUser = async (
  userId: string
): Promise<void> => transactionModel.deleteMany({ user: userId });

export const increaseAccountTransactionBalanceAfterTargetDate = async (
  accountId: string,
  date: Date,
  amount: number
): Promise<void> => {
  await transactionModel.updateMany(
    { fromAccount: accountId, date: { $gt: date } },
    { $inc: { fromAccountBalance: amount } }
  );
  await transactionModel.updateMany(
    { toAccount: accountId, date: { $gt: date } },
    { $inc: { toAccountBalance: amount } }
  );
};
