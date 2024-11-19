import { FC } from 'react';

import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { statisticsContextualNavigationItems } from '$constants/statisticsContextualNavigationItems';
import { Button } from '$elements/Button/Button';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';

type StatisticsLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const StatisticsLayout: FC<StatisticsLayoutProps> = async ({
  title,
  children,
}) => {
  const { data: accounts } = await AccountService.getAll();

  return (
    <Layout
      title={title}
      contextualNavigationItems={statisticsContextualNavigationItems}
    >
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
      {!!accounts.length && children}
    </Layout>
  );
};
