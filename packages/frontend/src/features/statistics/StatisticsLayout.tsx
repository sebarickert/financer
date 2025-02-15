import { Grid2X2 } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { Button } from '$elements/Button/Button';
import { Layout, LayoutProps } from '$layouts/Layout';
import { AccountService } from '$ssr/api/AccountService';

type StatisticsLayoutProps = Omit<LayoutProps, 'contextualNavigationItems'>;

export const StatisticsLayout: FC<StatisticsLayoutProps> = async ({
  children,
  ...rest
}) => {
  const accounts = await AccountService.getAll();

  return (
    <Layout {...rest}>
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
      {Boolean(accounts.length) && children}
    </Layout>
  );
};
