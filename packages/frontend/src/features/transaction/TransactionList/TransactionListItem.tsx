import clsx from 'clsx';
import { FC } from 'react';

import { TransactionTypeIcon } from '../TransactionTypeIcon';

import {
  ExpenseListItemDto,
  IncomeListItemDto,
  TransactionListItemDto,
  TransactionType,
  TransferListItemDto,
} from '$api/generated/financerApi';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
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
  const { color: transactionTypeColor } = transactionTypeThemeMapping[type];

  const url = `/transactions/${type.toLowerCase()}s/${id}`;
  const formattedCategories = categories.map(({ name }) => name).join(', ');

  return (
    <Link
      haptic="ultra-light"
      href={url}
      testId={id}
      className={clsx(
        'bg-layer hover:bg-accent active:bg-accent',
        'p-4 relative',
        'flex items-center gap-4',
      )}
      transition="slideInFromRight"
      hasHoverEffect={false}
    >
      <div className={clsx('inline-flex items-center justify-center shrink-0')}>
        <TransactionTypeIcon type={type} isRecurring={isRecurring} />
      </div>
      <div
        className={clsx('grid grid-cols-[auto_1fr] items-center gap-2 grow')}
      >
        <div className="inline-flex flex-col truncate">
          <span data-testid="transaction-description">{description}</span>
          <div className="text-sm text-muted-foreground">
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
        </div>
        <span className={clsx('font-medium text-right whitespace-nowrap')}>
          <span
            className={clsx(
              { [transactionTypeColor]: isIncome || isExpense },
              { 'py-2 px-2 rounded-md': isIncome || isExpense },
            )}
            data-testid="transaction-amount"
            data-transaction-type={type}
          >
            {isIncome && '+ '}
            {isExpense && '- '}
            {formatCurrency(amount)}
          </span>
        </span>
      </div>
    </Link>
  );
};
