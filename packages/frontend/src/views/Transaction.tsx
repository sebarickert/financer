import clsx from 'clsx';
import { FC } from 'react';

import {
  ExpenseDetailsDto,
  IncomeDetailsDto,
  TransactionType,
  TransferDetailsDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList, DetailsItem } from '$blocks/DetailsList';
import { transactionTypeIconMapping } from '$constants/transaction/transactionTypeIconMapping';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
import { Heading } from '$elements/Heading';
import { Icon, IconName } from '$elements/Icon';
import { CategoryService } from '$ssr/api/category.service';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type TransactionProps =
  | IncomeDetailsDto
  | ExpenseDetailsDto
  | TransferDetailsDto;

export const Transaction: FC<TransactionProps> = async ({
  type,
  date,
  categories,
  id,
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

  const { icon, color = '' } = {
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
            icon: transactionTypeIconMapping.EXPENSE,
            label: 'From Account',
            description: fromAccountName,
          },
        ]
      : []),
    ...(toAccountName
      ? [
          {
            icon: transactionTypeIconMapping.INCOME,
            label: 'To Account',
            description: toAccountName,
          },
        ]
      : []),
    {
      icon: 'CalendarIcon',
      label: 'Date',
      description: formatDate(new Date(date), DateFormat.long),
    },
    {
      icon: 'InformationCircleIcon',
      label: 'Type',
      description: capitalize(type.toLowerCase()),
    },
    {
      icon: 'ChatBubbleBottomCenterTextIcon',
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
          icon: 'TagIcon',
          label: 'Category',
          description: getCategoryNameById(categoryId as unknown as string),
        },
        {
          icon: 'InformationCircleIcon',
          label: 'Amount',
          description: formatCurrency(categoryAmount),
        },
        ...(categoryDescription
          ? [
              {
                icon: 'ChatBubbleBottomCenterTextIcon' as IconName,
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
          {icon && (
            <span
              className={clsx(
                'p-3 rounded-full inline-block',
                color,
                !color && 'bg-accent',
              )}
            >
              <Icon name={isRecurring ? 'ArrowPathIcon' : icon} />
            </span>
          )}
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
        <div className={clsx('grid gap-8', '')}>
          <DetailsList items={transactionDetails} />
          {categoryDetails.length > 0 && (
            <div data-testid="transaction-categories">
              <Heading disableResponsiveSizing>Categories</Heading>
              <div className="divide-y [&>div:not(:first-child)]:pt-4 [&>div:not(:last-child)]:pb-4">
                {categoryDetails.map((category) => (
                  <DetailsList
                    testId="category-details"
                    key={category[0].label}
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
