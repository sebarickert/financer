import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LucideIcon,
  Repeat,
} from 'lucide-react';

import { TransactionType } from '$api/generated/financerApi';

export const TRANSACTION_TYPE_MAPPING: Record<
  TransactionType,
  {
    label: {
      default: string;
      plural: string;
    };
    color: string;
    icon: LucideIcon;
  }
> = {
  [TransactionType.Income]: {
    label: { default: 'Income', plural: 'Incomes' },
    color: 'var(--color-green)',
    icon: ArrowDownToLine,
  },
  [TransactionType.Expense]: {
    label: { default: 'Expense', plural: 'Expenses' },
    color: 'var(--color-red)',
    icon: ArrowUpFromLine,
  },
  [TransactionType.Transfer]: {
    label: { default: 'Transfer', plural: 'Transfers' },
    color: 'var(--color-blue)',
    icon: Repeat,
  },
};
