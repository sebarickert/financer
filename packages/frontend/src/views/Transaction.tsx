import clsx from 'clsx';
import { Calendar, Info, MessageSquareText, Tag } from 'lucide-react';
import { FC } from 'react';

import {
  SchemaExpenseDetailsDto,
  SchemaIncomeDetailsDto,
  SchemaTransferDetailsDto,
} from '@/api/ssr-financer-api';
import { getAllCategoriesWithTree } from '@/api-service';
import { BalanceDisplay } from '@/blocks/BalanceDisplay';
import { Card } from '@/blocks/Card/Card';
import { CardHeader } from '@/blocks/Card/CardHeader';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Heading } from '@/elements/Heading';
import { TransactionTypeIcon } from '@/features/transaction/TransactionTypeIcon';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { capitalize } from '@/utils/capitalize';
import { formatCurrency } from '@/utils/formatCurrency';

type TransactionProps =
  | SchemaIncomeDetailsDto
  | SchemaExpenseDetailsDto
  | SchemaTransferDetailsDto;

export const Transaction: FC<TransactionProps> = async ({
  type,
  date,
  categories,
  amount,
  description,
  isRecurring,
  id,
  ...props
}) => {
  const fromAccountName =
    'fromAccountName' in props ? props.fromAccountName : null;
  const toAccountName = 'toAccountName' in props ? props.toAccountName : null;

  const transactionCategories = await getAllCategoriesWithTree();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories.find((category) => category.id === categoryId)
      ?.categoryTree ?? categoryId;

  const transactionDetails: DetailsItem[] = [
    ...(fromAccountName
      ? [
          {
            Icon: TRANSACTION_TYPE_MAPPING.EXPENSE.Icon,
            label: 'From Account',
            description: fromAccountName,
          },
        ]
      : []),
    ...(toAccountName
      ? [
          {
            Icon: TRANSACTION_TYPE_MAPPING.INCOME.Icon,
            label: 'To Account',
            description: toAccountName,
          },
        ]
      : []),
    {
      Icon: Calendar,
      label: 'Date',
      description: new DateService(date).format(DATE_FORMAT.LONG),
    },
    {
      Icon: Info,
      label: 'Type',
      description: capitalize(type.toLowerCase()),
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
    <>
      <style>{`
        [data-transaction='${id}'] {
         --color-type: ${TRANSACTION_TYPE_MAPPING[type].color};
        }
      `}</style>
      <div
        className={clsx('grid gap-4')}
        data-testid="transaction-details"
        data-transaction={id}
      >
        <Card className="flex flex-col items-center gap-4">
          <span
            className={clsx(
              'inline-flex size-12 rounded-full items-center justify-center bg-(--color-type)',
            )}
          >
            <TransactionTypeIcon type={type} isRecurring={isRecurring} />
          </span>
          <BalanceDisplay
            label="Amount"
            amount={amount}
            type={type}
            className='[&_[data-slot="label"]]:sr-only text-center'
          >
            <p
              className="text-muted-foreground mt-1"
              data-testid="transaction-description"
            >
              {description}
            </p>
          </BalanceDisplay>
          {isRecurring && (
            <p className="max-w-xs mx-auto text-sm text-center text-muted-foreground">
              This transaction was automatically created based on your saved
              template.
            </p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <Heading noMargin>Details</Heading>
          </CardHeader>
          <DetailsList items={transactionDetails} />
        </Card>
        {Boolean(categoryDetails.length) && (
          <Card data-testid="transaction-categories">
            <CardHeader>
              <Heading noMargin>Categories</Heading>
            </CardHeader>
            <div className="divide-y [&>div:not(:first-child)]:pt-4 [&>div:not(:last-child)]:pb-4">
              {categoryDetails.map((category, index) => (
                <DetailsList
                  testId="category-details"
                  key={`${category[0].label}_${index}`}
                  items={category}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
