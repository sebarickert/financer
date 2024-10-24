import clsx from 'clsx';
import { FC } from 'react';

import {
  ExpenseDto,
  IncomeDto,
  TransactionType,
  TransferDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
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

type TransactionProps = {
  transaction: IncomeDto | ExpenseDto | TransferDto;
  toAccount?: string;
  fromAccount?: string;
};

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
                icon: 'ChatBubbleBottomCenterTextIcon' as IconName,
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
          >
            <span className="sr-only">Edit</span>
            <Icon name="PencilIcon" />
          </Link>
        }
      />
      <section className={clsx('@container')}>
        <div
          className={clsx(
            'theme-layer-color rounded-md',
            'pt-8 pb-4 px-4',
            'grid gap-y-8 gap-x-4',
            '@3xl:pt-4 @3xl:grid-cols-[1fr,1.5fr]',
          )}
        >
          <BalanceDisplay type={transactionType} amount={transaction?.amount}>
            {`${transaction?.description}`}
          </BalanceDisplay>
          <div className="grid gap-8 p-6 border rounded-md theme-layer-secondary-color theme-border-primary">
            <DetailsList items={transactionDetails} />
            {categoryDetails.length > 0 && (
              <div>
                <Heading disableResponsiveSizing noMargin className="mb-4">
                  Categories
                </Heading>
                {categoryDetails.map((category) => (
                  <DetailsList
                    testId="category-details"
                    key={category[0].label}
                    items={category}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
