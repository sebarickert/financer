import { useMemo } from 'react';

import { TransactionTypeEnum, TransferDto } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDateLong } from '$utils/formatDate';

interface TransferProps {
  transfer: TransferDto;
  fromAccountName?: string;
  toAccountName?: string;
  getCategoryNameById: (categoryId: string) => string;
}

export const Transfer = ({
  transfer,
  fromAccountName,
  toAccountName,
  getCategoryNameById,
}: TransferProps): JSX.Element => {
  const transactionDetails = useMemo(
    () => [
      {
        icon: IconName.viewGrid,
        label: 'From Account',
        description: fromAccountName ?? '-',
      },
      {
        icon: IconName.viewGrid,
        label: 'To Account',
        description: toAccountName ?? '-',
      },
      {
        icon: IconName.calendar,
        label: 'Date',
        description: formatDateLong(new Date(transfer?.date)),
      },
      {
        icon: IconName.informationCircle,
        label: 'Type',
        description: 'Transfer',
      },
    ],
    [fromAccountName, toAccountName, transfer?.date]
  );

  const categoryDetails = useMemo(() => {
    return transfer.categories.map(({ amount, category_id, description }) => {
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
  }, [transfer.categories, getCategoryNameById]);

  return (
    <>
      <UpdatePageInfo
        title={'Transaction Details'}
        backLink="/statistics/transfers"
        headerAction={
          <ButtonInternal
            link={`/statistics/transfers/${transfer._id}/edit`}
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
          type={TransactionTypeEnum.Transfer}
          amount={transfer?.amount}
        >
          {`${transfer?.description}`}
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
      </section>
    </>
  );
};
