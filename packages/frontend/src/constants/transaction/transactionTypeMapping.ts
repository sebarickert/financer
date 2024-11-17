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
  { color: string; icon: IconName; hex?: string }
> = {
  [TransactionType.Income]: {
    color: 'bg-green-400/15',
    hex: '#10B981',
    icon: transactionTypeIconMapping[TransactionType.Income],
  },
  [TransactionType.Expense]: {
    color: 'bg-red-400/15',
    hex: '#EF4444',
    icon: transactionTypeIconMapping[TransactionType.Expense],
  },
  [TransactionType.Transfer]: {
    color: 'bg-gray-400/15',
    icon: transactionTypeIconMapping[TransactionType.Transfer],
  },
};
