import { TransactionType } from '$api/generated/financerApi';

export const getTransactionType = (
  toAccount: string | null | undefined,
  fromAccount: string | null | undefined,
): TransactionType => {
  if (toAccount && !fromAccount) {
    return TransactionType.Income;
  }

  if (!toAccount && fromAccount) {
    return TransactionType.Expense;
  }

  return TransactionType.Transfer;
};
