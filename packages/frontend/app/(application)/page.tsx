import { Metadata } from 'next';

import { RequireAccounts } from '@/components/RequireAccounts';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Dashboard } from '@/views/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const vtNames = generateNavigationViewTransitionName();
  return (
    <>
      <ContentHeader title="Dashboard" titleVtName={vtNames.dashboard} />
      <RequireAccounts>
        <Dashboard />
      </RequireAccounts>
    </>
  );
}
