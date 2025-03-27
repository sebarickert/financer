import { Metadata } from 'next';

import { Hero } from '@/components/Hero';
import { RequireAccounts } from '@/components/RequireAccounts';
import { Dashboard } from '@/views/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <>
      <Hero title="Dashboard" />
      <RequireAccounts>
        <Dashboard />
      </RequireAccounts>
    </>
  );
}
