import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/link/link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const TransferListingContainer: FC = () => {
  return (
    <>
      <UpdatePageInfo
        backLink="/statistics"
        headerAction={
          <Link
            href="/statistics/transfers/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-transfer"
          >
            <span className="sr-only">Add transfer</span>
            <Icon name="PlusIcon" />
          </Link>
        }
      />
      <TransactionListingWithMonthlyPager type={TransactionType.Transfer} />
    </>
  );
};
