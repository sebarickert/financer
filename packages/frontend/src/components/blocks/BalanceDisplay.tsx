import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { TransactionType } from '@/api/ssr-financer-api';
import { formatCurrency } from '@/utils/formatCurrency';

interface BalanceDisplayProps {
  className?: string;
  label: string;
  amount: number;
  children?: ReactNode;
  type?: TransactionType;
  balanceVtName?: string;
}

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  className,
  type,
  children,
  amount,
  label,
  balanceVtName,
}) => {
  const formattedAmount = formatCurrency(amount);

  const defaultValues = {
    balance: formattedAmount,
  };

  const typeMapping = {
    [TransactionType.INCOME]: {
      balance: `+${formattedAmount}`,
    },
    [TransactionType.EXPENSE]: {
      balance: `-${formattedAmount}`,
    },
    [TransactionType.TRANSFER]: {},
  };

  const { balance } = {
    ...defaultValues,
    ...(type ? typeMapping[type] : {}),
  };

  return (
    <div className={clsx(className)}>
      <p>
        <span className="block text-muted-foreground" data-slot="label">
          {label}
        </span>
        <span
          className="block text-4xl font-semibold break-all"
          data-testid="balance-amount"
          data-slot="balance"
          data-vt={!!balanceVtName}
          style={{
            '--vt-name': balanceVtName,
          }}
        >
          {balance}
        </span>
      </p>
      {children}
    </div>
  );
};
