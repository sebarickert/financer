import clsx from 'clsx';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LucideIcon,
  RefreshCw,
  Repeat,
} from 'lucide-react';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';

type TransactionTypeIconProps = {
  type: TransactionType;
  isRecurring?: boolean;
  className?: string;
};

export const TRANSACTION_TYPE_ICON_MAPPING: Record<
  TransactionType,
  LucideIcon
> = {
  [TransactionType.Expense]: ArrowUpFromLine,
  [TransactionType.Income]: ArrowDownToLine,
  [TransactionType.Transfer]: Repeat,
};

export const TransactionTypeIcon: FC<TransactionTypeIconProps> = ({
  type,
  className,
  isRecurring,
}) => {
  if (isRecurring) {
    return <RefreshCw className={clsx(className)} />;
  }

  const Icon = TRANSACTION_TYPE_ICON_MAPPING[type];

  return <Icon className={clsx(className)} />;
};
