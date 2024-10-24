import { transactionTypeIconMapping } from './transactionTypeIconMapping';

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
  Record<'color' | 'icon', string>
> = {
  [TransactionType.Income]: {
    color: 'bg-green-400/15',
    icon: transactionTypeIconMapping[TransactionType.Income],
  },
  [TransactionType.Expense]: {
    color: 'bg-red-400/15',
    icon: transactionTypeIconMapping[TransactionType.Expense],
  },
  [TransactionType.Transfer]: {
    color: 'bg-gray-400/15',
    icon: transactionTypeIconMapping[TransactionType.Transfer],
  },
};
