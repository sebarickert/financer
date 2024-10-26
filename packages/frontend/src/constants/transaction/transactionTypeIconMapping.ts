import { TransactionType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

export const transactionTypeIconMapping: Record<TransactionType, IconName> = {
  [TransactionType.Expense]: 'ArrowUpRightIcon',
  [TransactionType.Income]: 'ArrowDownLeftIcon',
  [TransactionType.Transfer]: 'ArrowsRightLeftIcon',
};
