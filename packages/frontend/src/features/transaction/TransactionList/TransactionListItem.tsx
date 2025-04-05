import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { FC, unstable_ViewTransition as ViewTransition } from 'react';

import {
  SchemaExpenseListItemDto,
  SchemaIncomeListItemDto,
  SchemaTransactionListItemDto,
  SchemaTransferListItemDto,
  TransactionType,
} from '@/api/ssr-financer-api';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Link } from '@/elements/Link';
import { generateTransactionViewTransitionName } from '@/features/transaction/generateTransactionViewTransitionName';
import { DateService } from '@/services/DateService';
import { formatCurrency } from '@/utils/formatCurrency';

export const TransactionListItem: FC<
  | SchemaTransactionListItemDto
  | SchemaExpenseListItemDto
  | SchemaIncomeListItemDto
  | SchemaTransferListItemDto
> = ({ amount, date, description, id, isRecurring, categories, type }) => {
  const isIncome = type === TransactionType.INCOME;
  const isExpense = type === TransactionType.EXPENSE;

  const url = `/transactions/${id}`;
  const formattedCategories = categories.map(({ name }) => name).join(', ');

  const ariaLabel = `${description}, ${isIncome ? '+' : isExpense ? '-' : ''}${formatCurrency(amount)}, ${new DateService(date).format()}, ${TRANSACTION_TYPE_MAPPING[type].label.default}${isRecurring ? ', Recurring' : ''}`;

  return (
    <>
      <style>{`
        [data-transaction-item='${id}'] {
         --color-type: ${TRANSACTION_TYPE_MAPPING[type].color};
        }
      `}</style>
      <Link
        // haptic="ultra-light"
        href={url}
        // testId={id}
        className={clsx(
          'bg-layer hover:bg-accent active:bg-accent',
          'py-4 px-6 relative',
          'grid',
        )}
        // hasHoverEffect={false}
        aria-label={ariaLabel}
        data-transaction-item={id}
      >
        <div className="flex items-center gap-6 justify-between overflow-hidden">
          <p
            data-testid="transaction-description"
            className="inline-flex items-center gap-2 truncate"
          >
            {isRecurring && (
              <RefreshCw className="size-4 text-muted-foreground shrink-0" />
            )}
            <ViewTransition
              name={generateTransactionViewTransitionName(id, 'name')}
            >
              <span
                className="truncate"
                data-debug={generateTransactionViewTransitionName(id, 'name')}
              >
                {description}
              </span>
            </ViewTransition>
          </p>
          <ViewTransition
            name={generateTransactionViewTransitionName(id, 'amount')}
          >
            <p
              className={clsx('text-right whitespace-nowrap')}
              data-testid="transaction-amount"
              data-transaction-type={type}
            >
              {isIncome && '+'}
              {isExpense && '-'}
              {formatCurrency(amount)}
            </p>
          </ViewTransition>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-6 justify-between overflow-hidden">
          <div className="truncate">
            <ViewTransition
              name={generateTransactionViewTransitionName(id, 'date')}
            >
              <time dateTime={date} data-testid="transaction-date">
                {new DateService(date).format()}
              </time>
            </ViewTransition>
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
      </Link>
    </>
  );
};
