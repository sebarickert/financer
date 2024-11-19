import { transactionTypeIconMapping } from './transactionTypeIconMapping';

import { TransactionType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

export const transactionTypeLabelMapping: {
  [key in TransactionType]: { default: string; plural: string };
} = {
  [TransactionType.Income]: { default: 'income', plural: 'incomes' },
  [TransactionType.Expense]: { default: 'expense', plural: 'expenses' },
  [TransactionType.Transfer]: { default: 'transfer', plural: 'transfers' },
};

export const transactionTypeThemeMapping: Record<
  TransactionType,
  { color: string; icon: IconName; hsl?: string }
> = {
  [TransactionType.Income]: {
    color: 'bg-green/15',
    hsl: 'hsl(var(--color-green))',
    icon: transactionTypeIconMapping[TransactionType.Income],
  },
  [TransactionType.Expense]: {
    color: 'bg-red/15',
    hsl: 'hsl(var(--color-red))',
    icon: transactionTypeIconMapping[TransactionType.Expense],
  },
  [TransactionType.Transfer]: {
    color: 'bg-border-primary',
    icon: transactionTypeIconMapping[TransactionType.Transfer],
  },
};
