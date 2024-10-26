import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { transactionTypeIconMapping } from '$constants/transaction/transactionTypeIconMapping';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
import { Icon } from '$elements/Icon';
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
  const isIncome = transactionType === 'INCOME';
  const isExpense = transactionType === 'EXPENSE';
  const { color: transactionTypeColor } =
    transactionTypeThemeMapping[transactionType];

  const isRecurring = false;

  return (
    <Link
      haptic="ultra-light"
      href={url}
      testId={id}
      className={clsx(
        'theme-layer-color-with-hover',
        'py-5 px-4 relative',
        'flex items-center gap-4',
      )}
      transition="slideInFromRight"
    >
      <div className={clsx('inline-flex items-center justify-center shrink-0')}>
        <Icon
          name={
            isRecurring
              ? 'ArrowPathIcon'
              : transactionTypeIconMapping[transactionType]
          }
        />
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
              { [transactionTypeColor]: isIncome || isExpense },
              { 'py-2 px-2 rounded-md': isIncome || isExpense },
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
