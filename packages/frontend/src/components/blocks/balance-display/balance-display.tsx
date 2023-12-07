import clsx from 'clsx';

import { TransactionTypeEnum } from '$api/generated/financerApi';
import { Icon, IconName } from '$elements/icon/icon';
import { formatCurrency } from '$utils/formatCurrency';

interface BalanceDisplayProps {
  className?: string;
  type?: Exclude<TransactionTypeEnum, TransactionTypeEnum.Any>;
  children?: string;
  amount: number;
  iconName?: IconName;
}

export const BalanceDisplay = ({
  className = '',
  type,
  children,
  amount,
  iconName,
}: BalanceDisplayProps) => {
  const formattedAmount = formatCurrency(amount);

  const defaultValues = {
    balance: formattedAmount,
    icon: iconName,
    color: 'text-black',
  };

  const typeMapping = {
    [TransactionTypeEnum.Income]: {
      balance: `+ ${formattedAmount}`,
      icon: IconName.download,
      color: 'text-green',
    },
    [TransactionTypeEnum.Expense]: {
      balance: `- ${formattedAmount}`,
      icon: IconName.upload,
      color: 'text-red',
    },
    [TransactionTypeEnum.Transfer]: {
      icon: IconName.switchHorizontal,
    },
  };

  const { balance, icon, color } = {
    ...defaultValues,
    ...(type ? typeMapping[type] : {}),
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center gap-4',
        {
          [className]: true,
        }
      )}
    >
      {icon && (
        <span
          className={clsx(
            'inline-flex items-center justify-center bg-gray rounded-full h-11 w-11'
          )}
        >
          <Icon
            type={icon}
            className={clsx(
              'flex-shrink-0 pointer-events-none stroke-black/75'
            )}
          />
        </span>
      )}
      <div>
        <p
          className={clsx('text-4xl font-semibold break-all', {
            [color]: color,
          })}
        >
          <span className="sr-only">Amount:</span>
          {balance}
        </p>
        <p className="text-base">
          <span className="sr-only">Description:</span>
          {children}
        </p>
      </div>
    </div>
  );
};
