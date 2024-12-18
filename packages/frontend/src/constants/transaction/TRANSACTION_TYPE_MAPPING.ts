import { TransactionType } from '$api/generated/financerApi';

export const TRANSACTION_TYPE_MAPPING: Record<
  TransactionType,
  {
    label: {
      default: string;
      plural: string;
    };
    color: string;
  }
> = {
  [TransactionType.Income]: {
    label: { default: 'Income', plural: 'Incomes' },
    color: 'var(--color-green)',
  },
  [TransactionType.Expense]: {
    label: { default: 'Expense', plural: 'Expense' },
    color: 'var(--color-red)',
  },
  [TransactionType.Transfer]: {
    label: { default: 'Transfer', plural: 'Transfers' },
    color: 'var(--color-blue)',
  },
};
