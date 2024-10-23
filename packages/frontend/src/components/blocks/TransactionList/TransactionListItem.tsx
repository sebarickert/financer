import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { IconName, Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

export type TransactionListItemProps = {
  transactionCategories?: string;
  url: string;
  transactionType: TransactionType;
  description: string;
  date: string;
  amount: number;
  id: string;
};

export const TransactionListItem: FC<TransactionListItemProps> = ({
  transactionCategories,
  amount,
  date,
  description,
  url,
  transactionType,
  id,
}) => {
  const iconTypeMapping: {
    [key in TransactionType]: IconName;
  } = {
    EXPENSE: 'ArrowTurnUpRightIcon',
    INCOME: 'ArrowTurnDownLeftIcon',
    TRANSFER: 'ArrowsRightLeftIcon',
  };

  const isIncome = transactionType === 'INCOME';
  const isExpense = transactionType === 'EXPENSE';

  return (
    <Link
      href={url}
      testId="account-row"
      className={clsx(
        'theme-layer-color-with-hover',
        'py-5 px-4',
        'flex items-center gap-4',
      )}
      transition="slideInFromRight"
      data-testid={id}
    >
      <div
        className={clsx(
          'rounded-xl h-11 w-11',
          'inline-flex items-center justify-center shrink-0',
          { 'bg-green-400/15': isIncome },
          { 'bg-red-400/15': isExpense },
          { 'bg-gray-400/15': !isIncome && !isExpense },
        )}
      >
        <Icon name={iconTypeMapping[transactionType]} />
      </div>
      <div
        className={clsx('grid grid-cols-[auto,1fr] items-center gap-2 grow')}
      >
        <div className="inline-flex flex-col truncate">
          <span>{description}</span>
          <div className="text-sm">
            <time dateTime={date}>{formatDate(new Date(date))}</time>
            {transactionCategories && (
              <>
                {' - '}
                <span>
                  <span className="sr-only">Categories: </span>
                  {transactionCategories}
                </span>
              </>
            )}
          </div>
        </div>
        <span className={clsx('font-medium text-right whitespace-nowrap')}>
          <span
            className={clsx(
              'py-2 px-3 rounded-md',
              { 'bg-green-400/15': isIncome },
              { 'bg-red-400/15': isExpense },
              { 'bg-gray-400/15': !isIncome && !isExpense },
            )}
          >
            {transactionType === 'INCOME' && '+ '}
            {transactionType === 'EXPENSE' && '- '}
            {formatCurrency(amount)}
          </span>
        </span>
      </div>
    </Link>
  );
};
