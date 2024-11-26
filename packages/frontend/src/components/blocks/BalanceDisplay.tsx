import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { formatCurrency } from '$utils/formatCurrency';

type BalanceDisplayProps = {
  className?: string;
  label: string;
  amount: number;
  children?: ReactNode;
  type?: TransactionType;
};

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  className,
  type,
  children,
  amount,
  label,
}) => {
  const formattedAmount = formatCurrency(amount);

  const defaultValues = {
    balance: formattedAmount,
  };

  const typeMapping = {
    [TransactionType.Income]: {
      balance: `+ ${formattedAmount}`,
    },
    [TransactionType.Expense]: {
      balance: `- ${formattedAmount}`,
    },
    [TransactionType.Transfer]: {},
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
          data-testid="balance-display-balance"
        >
          {balance}
        </span>
      </p>
      {children}
    </div>
  );
};
