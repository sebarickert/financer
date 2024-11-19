import clsx from 'clsx';
import { FC } from 'react';

import {
  ExpenseDetailsDto,
  IncomeDetailsDto,
  TransferDetailsDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { Heading } from '$elements/Heading';
import { IconName } from '$elements/Icon';
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
  ...props
}) => {
  const fromAccountName =
    'fromAccountName' in props ? props.fromAccountName : null;
  const toAccountName = 'toAccountName' in props ? props.toAccountName : null;

  const transactionCategories = await CategoryService.getAllWithTree();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category.id === categoryId)
      ?.categoryTree || categoryId;

  const transactionDetails: DetailsItem[] = [
    ...(fromAccountName
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
            label: 'From Account',
            description: fromAccountName,
          },
        ]
      : []),
    ...(toAccountName
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
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
      className={clsx(
        'bg-layer rounded-md',
        'pt-12 pb-10 px-6',
        'grid gap-12',
        'max-w-md mx-auto',
      )}
      data-testid="transaction-details"
    >
      <BalanceDisplay
        type={type}
        amount={amount}
        testId="transaction-amount"
        childTestId="transaction-description"
      >
        {`${description}`}
      </BalanceDisplay>
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
  );
};
