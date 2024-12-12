import { TransactionType } from '$api/generated/financerApi';

export const transactionTypeLabelMapping: {
  [key in TransactionType]: { default: string; plural: string };
} = {
  [TransactionType.Income]: { default: 'income', plural: 'incomes' },
  [TransactionType.Expense]: { default: 'expense', plural: 'expenses' },
  [TransactionType.Transfer]: { default: 'transfer', plural: 'transfers' },
};

export const transactionTypeThemeMapping: Record<
  TransactionType,
  { color: string; hsl?: string }
> = {
  [TransactionType.Income]: {
    color: 'bg-green/15',
    hsl: 'var(--color-green)',
  },
  [TransactionType.Expense]: {
    color: 'bg-red/15',
    hsl: 'var(--color-red)',
  },
  [TransactionType.Transfer]: {
    color: 'bg-accent',
  },
};
