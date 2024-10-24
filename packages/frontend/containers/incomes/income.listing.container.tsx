import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const IncomeListingContainer: FC = () => {
  return (
    <>
      <UpdatePageInfo backLink="/statistics" />
      <TransactionListWithMonthlyPager type={TransactionType.Income} />
    </>
  );
};
