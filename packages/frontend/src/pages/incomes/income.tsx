import { useMemo } from 'react';

import { IncomeDto, TransactionTypeEnum } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { TransactionDelete } from '$blocks/transaction-delete/transaction-delete';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDateLong } from '$utils/formatDate';

interface IncomeProps {
  isLoading: boolean;
  income: IncomeDto;
  accountName?: string;
  onDelete: () => void;
  getCategoryNameById: (categoryId: string) => string;
}

export const Income = ({
  isLoading,
  income,
  accountName,
  onDelete,
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
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={'Transaction Details'}
        backLink="/statistics/incomes"
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
          className="mb-12"
          type={TransactionTypeEnum.Income}
          amount={income?.amount}
        >
          {`${income?.description}`}
        </BalanceDisplay>
        <DetailsList items={transactionDetails} />
        {categoryDetails.length > 0 && (
          <section className="mt-8">
            <Heading className="mb-4">Categories</Heading>
            <div className="grid divide-y divide-gray-dark">
              {categoryDetails.map((category) => (
                <span
                  key={category[0].label}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <DetailsList items={category} />
                </span>
              ))}
            </div>
          </section>
        )}
        <TransactionDelete onDelete={onDelete} />
      </section>
    </>
  );
};
