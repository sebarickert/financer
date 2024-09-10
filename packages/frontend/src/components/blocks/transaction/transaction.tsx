import { FC } from 'react';

import {
  ExpenseDto,
  IncomeDto,
  TransactionType,
  TransferDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
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

  const transactionDetails = [
    ...(fromAccount
      ? [
          {
            icon: IconName.viewGrid,
            label: 'From Account',
            description: fromAccount,
          },
        ]
      : []),
    ...(toAccount
      ? [
          {
            icon: IconName.viewGrid,
            label: 'To Account',
            description: toAccount,
          },
        ]
      : []),
    {
      icon: IconName.calendar,
      label: 'Date',
      description: formatDate(new Date(transaction?.date), DateFormat.long),
    },
    {
      icon: IconName.informationCircle,
      label: 'Type',
      description: capitalize(transactionDetailsMapping.type ?? '-'),
    },
  ];

  const categoryDetails = transaction.categories.map(
    ({ amount, categoryId, description }) => {
      return [
        {
          icon: IconName.tag,
          label: 'Category',
          description: getCategoryNameById(categoryId as unknown as string),
        },
        {
          icon: IconName.informationCircle,
          label: 'Amount',
          description: formatCurrency(amount),
        },
        ...(description
          ? [
              {
                icon: IconName.annotation,
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
          <ButtonInternal
            link={`/statistics/${transactionDetailsMapping.url}/${transaction.id}/edit`}
            testId={`edit-${transactionDetailsMapping.type}-button`}
            transition="open-from-right"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Edit</span>
            <Icon type={IconName.pencilSquare} />
          </ButtonInternal>
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
            <Heading className="mb-4">Categories</Heading>
            <div className="grid divide-y divide-gray-dark border-t border-b border-gray-dark">
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
