import { FC } from 'react';

import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { Button } from '$elements/Button/Button';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';
import { UserService } from '$ssr/api/user.service';

export const StatisticsContainer: FC = async () => {
  const theme = await UserService.getOwnUserTheme();
  const { data: accounts } = await AccountService.getAll();

  return (
    <Layout title="Statistics">
      {!accounts.length && (
        <EmptyContentBlock
          title="No Accounts Added"
          icon="Squares2X2Icon"
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </EmptyContentBlock>
      )}
      {!!accounts.length && (
        <>
          <MonthlySummaryGraph className="mb-8" userTheme={theme} />
          <TransactionListWithMonthlyPager isSummaryVisible />
        </>
      )}
    </Layout>
  );
};
