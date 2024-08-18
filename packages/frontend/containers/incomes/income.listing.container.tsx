'use client';

import { useIncomesFindAllByUserQuery } from '$api/generated/financerApi';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface IncomeListingContainerProps {
  date?: string;
  page?: number;
}

export const IncomeListingContainer = ({
  date,
  page,
}: IncomeListingContainerProps) => {
  return (
    <>
      <UpdatePageInfo
        title="Incomes"
        backLink="/statistics"
        headerAction={
          <ButtonInternal
            link="/statistics/incomes/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-income"
          >
            <span className="sr-only">Add income</span>
            <Icon type={IconName.plus} />
          </ButtonInternal>
        }
      />
      <TransactionListingWithMonthlyPager
        initialDate={date}
        initialPage={page}
        useDataHook={useIncomesFindAllByUserQuery}
      />
    </>
  );
};
