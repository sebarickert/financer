import { Metadata } from 'next';

import { RequireAccounts } from '@/components/RequireAccounts';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Dashboard } from '@/views/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <>
      <ContentHeader title={'Dashboard'} />
      <RequireAccounts>
        <Dashboard />
      </RequireAccounts>
    </>
  );
}
