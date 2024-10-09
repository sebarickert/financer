import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { Icon } from '$elements/icon/icon.new';
import { Link } from '$elements/link/link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const ExpenseListingContainer: FC = () => {
  return (
    <>
      <UpdatePageInfo
        backLink="/statistics"
        headerAction={
          <Link
            href="/statistics/expenses/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-expense"
          >
            <span className="sr-only">Add expense</span>
            <Icon name="PlusIcon" />
          </Link>
        }
      />
      <TransactionListingWithMonthlyPager type={TransactionType.Expense} />
    </>
  );
};
