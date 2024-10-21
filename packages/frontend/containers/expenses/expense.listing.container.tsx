import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const ExpenseListingContainer: FC = () => {
  return (
    <>
      <UpdatePageInfo backLink="/statistics" />
      <TransactionListingWithMonthlyPager type={TransactionType.Expense} />
    </>
  );
};
