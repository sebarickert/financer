import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { Icon, IconName } from '$elements/icon/icon';
import { Link } from '$elements/link/link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const IncomeListingContainer: FC = () => {
  return (
    <>
      <UpdatePageInfo
        backLink="/statistics"
        headerAction={
          <Link
            href="/statistics/incomes/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-income"
          >
            <span className="sr-only">Add income</span>
            <Icon type={IconName.plus} />
          </Link>
        }
      />
      <TransactionListingWithMonthlyPager type={TransactionType.Income} />
    </>
  );
};
