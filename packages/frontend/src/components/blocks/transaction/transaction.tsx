import { FC } from 'react';

import {
  ExpenseDto,
  IncomeDto,
  TransactionType,
  TransferDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { Heading } from '$elements/Heading';
import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { CategoryService } from '$ssr/api/category.service';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';
import { getTransactionType } from '$utils/transaction/getTransactionType';

interface TransactionProps {
  transaction: IncomeDto | ExpenseDto | TransferDto;
  toAccount?: string;
  fromAccount?: string;
}

const getUrlMapping = (transactionType: TransactionType) => {
  switch (transactionType) {
    case TransactionType.Transfer:
      return {
        type: 'transfer',
        url: 'transfers',
      };
    case TransactionType.Income:
      return {
        type: 'income',
        url: 'incomes',
      };
    case TransactionType.Expense:
      return {
        type: 'expense',
        url: 'expenses',
      };
  }
};

export const Transaction: FC<TransactionProps> = async ({
  transaction,
  toAccount,
  fromAccount,
}) => {
  const transactionCategories = await CategoryService.getAllWithTree();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category.id === categoryId)
      ?.categoryTree || categoryId;

  const transactionType = getTransactionType(toAccount, fromAccount);

  const transactionDetailsMapping = getUrlMapping(transactionType);

  const transactionDetails: DetailsItem[] = [
    ...(fromAccount
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
            label: 'From Account',
            description: fromAccount,
          },
        ]
      : []),
    ...(toAccount
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
            label: 'To Account',
            description: toAccount,
          },
        ]
      : []),
    {
      icon: 'CalendarIcon',
      label: 'Date',
      description: formatDate(new Date(transaction?.date), DateFormat.long),
    },
    {
      icon: 'InformationCircleIcon',
      label: 'Type',
      description: capitalize(transactionDetailsMapping.type ?? '-'),
    },
  ];

  const categoryDetails: DetailsItem[][] = transaction.categories.map(
    ({ amount, categoryId, description }) => {
      return [
        {
          icon: 'TagIcon' as IconName,
          label: 'Category',
          description: getCategoryNameById(categoryId as unknown as string),
        },
        {
          icon: 'InformationCircleIcon' as IconName,
          label: 'Amount',
          description: formatCurrency(amount),
        },
        ...(description
          ? [
              {
                icon: 'ChatBubbleBottomCenterIcon' as IconName,
                label: 'Description',
                description,
              },
            ]
          : []),
      ];
    },
  );

  return (
    <>
      <UpdatePageInfo
        backLink="/statistics"
        headerAction={
          <Link
            href={`/statistics/${transactionDetailsMapping.url}/${transaction.id}/edit`}
            testId={`edit-${transactionDetailsMapping.type}-button`}
            transition="slideInFromRight"
            // className="inline-flex items-center justify-center h-11 w-11 theme-layer-color-with-hover"
          >
            <span className="sr-only">Edit</span>
            <Icon name="PencilSquareIcon" />
          </Link>
        }
      />
      <section>
        <BalanceDisplay
          className="mb-6"
          type={transactionType}
          amount={transaction?.amount}
        >
          {`${transaction?.description}`}
        </BalanceDisplay>
        <DetailsList
          items={transactionDetails}
          className="py-4 border-t border-b border-gray-dark"
        />
        {categoryDetails.length > 0 && (
          <section className="mt-8">
            <Heading>Categories</Heading>
            <div className="grid border-t border-b divide-y divide-gray-dark border-gray-dark">
              {categoryDetails.map((category) => (
                <DetailsList
                  testId="category-details"
                  key={category[0].label}
                  items={category}
                  className="py-4"
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
};
