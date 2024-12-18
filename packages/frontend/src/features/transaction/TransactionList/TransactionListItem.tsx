import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { FC } from 'react';

import {
  ExpenseListItemDto,
  IncomeListItemDto,
  TransactionListItemDto,
  TransactionType,
  TransferListItemDto,
} from '$api/generated/financerApi';
import { TRANSACTION_TYPE_MAPPING } from '$constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Link } from '$elements/Link';
import { DateService } from '$services/DateService';
import { formatCurrency } from '$utils/formatCurrency';

export const TransactionListItem: FC<
  | TransactionListItemDto
  | ExpenseListItemDto
  | IncomeListItemDto
  | TransferListItemDto
> = ({ amount, date, description, id, isRecurring, categories, type }) => {
  const isIncome = type === TransactionType.Income;
  const isExpense = type === TransactionType.Expense;

  const url = `/transactions/${type.toLowerCase()}s/${id}`;
  const formattedCategories = categories.map(({ name }) => name).join(', ');

  const ariaLabel = `${description}, ${isIncome ? '+' : isExpense ? '-' : ''}${formatCurrency(amount)}, ${new DateService(date).format()}, ${TRANSACTION_TYPE_MAPPING[type].label.default}${isRecurring ? ', Recurring' : ''}`;

  return (
    <>
      <style>{`
        [data-transaction-item='${id}'] {
         ${`--color-type: ${TRANSACTION_TYPE_MAPPING[type].color};`}
        }
      `}</style>
      <Link
        haptic="ultra-light"
        href={url}
        testId={id}
        className={clsx(
          'bg-layer hover:bg-accent active:bg-accent',
          'p-4 px-6 relative',
          'flex items-center gap-4',
        )}
        transition="slideInFromRight"
        hasHoverEffect={false}
        aria-label={ariaLabel}
        data-transaction-item={id}
      >
        <div className={clsx('grid w-full')}>
          <div className="flex items-center gap-6 justify-between overflow-hidden">
            <p
              data-testid="transaction-description"
              className="inline-flex items-center gap-2 truncate"
            >
              {isRecurring && (
                <RefreshCw className="size-4 text-muted-foreground shrink-0" />
              )}
              <span className="truncate">{description}</span>
            </p>
            <p
              className={clsx('text-right whitespace-nowrap')}
              data-testid="transaction-amount"
              data-transaction-type={type}
            >
              {isIncome && '+'}
              {isExpense && '-'}
              {formatCurrency(amount)}
            </p>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-6 justify-between overflow-hidden">
            <div className="truncate">
              <time dateTime={date} data-testid="transaction-date">
                {new DateService(date).format()}
              </time>
              {formattedCategories && (
                <>
                  {' - '}
                  <span data-testid="transaction-categories">
                    <span className="sr-only">Categories: </span>
                    {formattedCategories}
                  </span>
                </>
              )}
            </div>
            <span className={clsx('inline-flex items-center gap-2')}>
              {TRANSACTION_TYPE_MAPPING[type].label.default}
              <span
                className={clsx(
                  'size-3 rounded-full inline-block bg-(--color-type)',
                )}
              />
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};
