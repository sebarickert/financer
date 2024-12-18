import { TransactionType } from '$api/generated/financerApi';

export const transactionTypeThemeMapping: Record<
  TransactionType,
  { color: string; hsl?: string }
> = {
  [TransactionType.Income]: {
    color: 'bg-green/50',
    hsl: 'var(--color-green)',
  },
  [TransactionType.Expense]: {
    color: 'bg-red/50',
    hsl: 'var(--color-red)',
  },
  [TransactionType.Transfer]: {
    color: 'bg-accent',
  },
};
