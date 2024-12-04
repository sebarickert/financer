import { Grid2X2 } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
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
  const accounts = await AccountService.getAll();

  return (
    <Layout
      title={title}
      contextualNavigationItems={statisticsContextualNavigationItems}
    >
      {!accounts.length && (
        <InfoMessageBlock
          title="No Accounts Added"
          Icon={Grid2X2}
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </InfoMessageBlock>
      )}
      {!!accounts.length && children}
    </Layout>
  );
};
