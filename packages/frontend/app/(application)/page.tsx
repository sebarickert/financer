import { Grid2x2 } from 'lucide-react';
import { Metadata } from 'next';

import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { Button } from '@/elements/Button/Button';
import { ContentHeader } from '@/layouts/ContentHeader';
import { AccountService } from '@/ssr/api/AccountService';
import { Dashboard } from '@/views/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const accounts = await AccountService.getAll();

  return (
    <>
      <ContentHeader title={'Dashboard'} />
      {!accounts.length && (
        <InfoMessageBlock
          title="No Accounts Added"
          Icon={Grid2x2}
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </InfoMessageBlock>
      )}
      {!!accounts.length && <Dashboard />}
    </>
  );
}
