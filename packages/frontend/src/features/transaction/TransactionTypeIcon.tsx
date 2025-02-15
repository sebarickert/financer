import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TRANSACTION_TYPE_MAPPING } from '$constants/transaction/TRANSACTION_TYPE_MAPPING';

interface TransactionTypeIconProps {
  type: TransactionType;
  isRecurring?: boolean;
  className?: string;
}

export const TransactionTypeIcon: FC<TransactionTypeIconProps> = ({
  type,
  className,
  isRecurring,
}) => {
  if (isRecurring) {
    return <RefreshCw className={clsx(className)} />;
  }

  const { Icon } = TRANSACTION_TYPE_MAPPING[type];

  return <Icon className={clsx(className)} />;
};
