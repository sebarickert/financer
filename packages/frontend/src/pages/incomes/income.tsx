import { useMemo } from 'react';

import { IncomeDto, TransactionTypeEnum } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDateLong } from '$utils/formatDate';

interface IncomeProps {
  income: IncomeDto;
  accountName?: string;
  getCategoryNameById: (categoryId: string) => string;
}

export const Income = ({
  income,
  accountName,
  getCategoryNameById,
}: IncomeProps): JSX.Element => {
  const transactionDetails = useMemo(
    () => [
      {
        icon: IconName.viewGrid,
        label: 'To Account',
        description: accountName ?? '-',
      },
      {
        icon: IconName.calendar,
        label: 'Date',
        description: formatDateLong(new Date(income?.date)),
      },
      {
        icon: IconName.informationCircle,
        label: 'Type',
        description: 'Income',
      },
    ],
    [accountName, income?.date]
  );

  const categoryDetails = useMemo(() => {
    return income.categories.map(({ amount, category_id, description }) => {
      return [
        {
          icon: IconName.tag,
          label: 'Category',
          description: getCategoryNameById(category_id as unknown as string),
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
    });
  }, [income.categories, getCategoryNameById]);

  return (
    <>
      <UpdatePageInfo
        title={'Transaction Details'}
        backLink="/statistics"
        headerAction={
          <ButtonInternal
            link={`/statistics/incomes/${income._id}/edit`}
            testId="edit-income-button"
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
          type={TransactionTypeEnum.Income}
          amount={income?.amount}
        >
          {`${income?.description}`}
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
