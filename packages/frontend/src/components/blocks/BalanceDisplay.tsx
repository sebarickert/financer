import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
import { Icon, IconName } from '$elements/Icon';
import { formatCurrency } from '$utils/formatCurrency';

type BalanceDisplayProps = {
  className?: string;
  type?: TransactionType;
  children?: string;
  amount: number;
  iconName?: IconName;
  testId?: string;
  childTestId?: string;
};

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  className,
  type,
  children,
  amount,
  iconName,
  testId,
  childTestId,
}) => {
  const formattedAmount = formatCurrency(amount);

  const defaultValues = {
    balance: formattedAmount,
    icon: iconName,
  };

  const typeMapping = {
    [TransactionType.Income]: {
      balance: `+ ${formattedAmount}`,
      ...transactionTypeThemeMapping[TransactionType.Income],
    },
    [TransactionType.Expense]: {
      balance: `- ${formattedAmount}`,
      ...transactionTypeThemeMapping[TransactionType.Expense],
    },
    [TransactionType.Transfer]: {
      ...transactionTypeThemeMapping[TransactionType.Transfer],
    },
  };

  const {
    balance,
    icon,
    color = '',
  } = {
    ...defaultValues,
    ...(type ? typeMapping[type] : {}),
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center gap-4',
        ``,
        className,
      )}
    >
      {icon && (
        <div
          className={clsx(
            'relative rounded-xl h-11 w-11',
            'inline-flex items-center justify-center shrink-0',
            { 'bg-border-primary': !color },
            { [color]: color },
          )}
        >
          <Icon name={icon} />
        </div>
      )}
      <div>
        <p className={clsx('text-4xl font-semibold break-all')}>
          <span className="sr-only">Amount:</span>
          <span data-testid={testId}>{balance}</span>
        </p>
        {children && (
          <p className="text-lg">
            <span className="sr-only">Description:</span>
            <span data-testid={childTestId}>{children}</span>
          </p>
        )}
      </div>
    </div>
  );
};
