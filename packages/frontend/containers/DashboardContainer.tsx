import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { Button } from '$elements/Button/Button';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';
import { Dashboard } from '$views/Dashboard';

export const DashboardContainer: FC = async () => {
  const accounts = await AccountService.getAll();

  return (
    <Layout title="Dashboard">
      {!accounts.length && (
        <InfoMessageBlock
          title="No Accounts Added"
          icon="Squares2X2Icon"
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </InfoMessageBlock>
      )}
      {!!accounts.length && <Dashboard />}
    </Layout>
  );
};
