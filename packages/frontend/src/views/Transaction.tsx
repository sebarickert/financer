import clsx from 'clsx';
import { Calendar, Info, MessageSquareText, Tag } from 'lucide-react';
import { FC } from 'react';

import {
  ExpenseDetailsDto,
  IncomeDetailsDto,
  TransactionType,
  TransferDetailsDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList, DetailsItem } from '$blocks/DetailsList';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
import { Heading } from '$elements/Heading';
import {
  TRANSACTION_TYPE_ICON_MAPPING,
  TransactionTypeIcon,
} from '$features/transaction/TransactionTypeIcon';
import { DateService } from '$services/DateService';
import { CategoryService } from '$ssr/api/CategoryService';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionProps =
  | IncomeDetailsDto
  | ExpenseDetailsDto
  | TransferDetailsDto;

export const Transaction: FC<TransactionProps> = async ({
  type,
  date,
  categories,
  amount,
  description,
  isRecurring,
  ...props
}) => {
  const fromAccountName =
    'fromAccountName' in props ? props.fromAccountName : null;
  const toAccountName = 'toAccountName' in props ? props.toAccountName : null;

  const typeMapping = {
    [TransactionType.Income]: {
      ...transactionTypeThemeMapping[TransactionType.Income],
      color: 'bg-green text-white',
    },
    [TransactionType.Expense]: {
      ...transactionTypeThemeMapping[TransactionType.Expense],
      color: 'bg-red text-white',
    },
    [TransactionType.Transfer]: {
      ...transactionTypeThemeMapping[TransactionType.Transfer],
      color: 'bg-accent text-foreground',
    },
  };

  const { color = '' } = {
    ...(type ? typeMapping[type] : {}),
  };

  const transactionCategories = await CategoryService.getAllWithTree();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category.id === categoryId)
      ?.categoryTree || categoryId;

  const transactionDetails: DetailsItem[] = [
    ...(fromAccountName
      ? [
          {
            Icon: TRANSACTION_TYPE_ICON_MAPPING.EXPENSE,
            label: 'From Account',
            description: fromAccountName,
          },
        ]
      : []),
    ...(toAccountName
      ? [
          {
            Icon: TRANSACTION_TYPE_ICON_MAPPING.INCOME,
            label: 'To Account',
            description: toAccountName,
          },
        ]
      : []),
    {
      Icon: Calendar,
      label: 'Date',
      description: new DateService(date).format(DateService.DATE_FORMAT.LONG),
    },
    {
      Icon: Info,
      label: 'Type',
      description: capitalize(type.toLowerCase()),
    },
    {
      Icon: MessageSquareText,
      label: 'Description',
      description,
    },
  ];

  const categoryDetails: DetailsItem[][] = categories.map(
    ({
      amount: categoryAmount,
      description: categoryDescription,
      id: categoryId,
    }) => {
      return [
        {
          Icon: Tag,
          label: 'Category',
          description: getCategoryNameById(categoryId as unknown as string),
        },
        {
          Icon: Info,
          label: 'Amount',
          description: formatCurrency(categoryAmount),
        },
        ...(categoryDescription
          ? [
              {
                Icon: MessageSquareText,
                label: 'Description',
                description: categoryDescription,
              },
            ]
          : []),
      ];
    },
  );

  return (
    <div
      className={clsx('bg-layer rounded-md relative isolate', 'p-6')}
      data-testid="transaction-details"
    >
      <div className="grid divide-y [&>:first-child]:pb-6 [&>:first-child+div]:pt-6">
        <div className="flex flex-col items-center gap-4">
          <span
            className={clsx(
              'p-3 rounded-full inline-block',
              color,
              !color && 'bg-accent',
            )}
          >
            <TransactionTypeIcon type={type} isRecurring={isRecurring} />
          </span>
          <BalanceDisplay
            label="Amount"
            amount={amount}
            className='[&_[data-slot="label"]]:sr-only'
            type={type}
          />
          {isRecurring && (
            <p className="max-w-xs mx-auto text-sm text-center text-muted-foreground">
              This transaction was automatically created based on your saved
              template.
            </p>
          )}
        </div>
        <div className={clsx('grid gap-6', '')}>
          <DetailsList items={transactionDetails} />
          {categoryDetails.length > 0 && (
            <div data-testid="transaction-categories">
              <Heading>Categories</Heading>
              <div className="divide-y [&>div:not(:first-child)]:pt-4 [&>div:not(:last-child)]:pb-4">
                {categoryDetails.map((category, index) => (
                  <DetailsList
                    testId="category-details"
                    key={category[0].label + index}
                    items={category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
