import { Metadata } from 'next';

import { handleDashboardSettingsUpdate } from '@/actions/settings/handleDashboardSettingsUpdate';
import {
  getDashboardSettings,
  getTransactionListChunkSize,
} from '@/api-service';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserDashboardSettingsForm } from '@/views/user-preferences/UserDashboardSettingsForm';

export const metadata: Metadata = {
  title: 'Dashboard Settings',
};

export default async function DashboardSettingsUserPreferencePage() {
  const dashboardSettings = await getDashboardSettings();
  const defaultChunkSize = await getTransactionListChunkSize();

  const data = {
    accountTypes: dashboardSettings?.accountTypes,
    chunkSize: defaultChunkSize,
  };

  return (
    <>
      <ContentHeader title="Dashboard Settings" />
      <UserDashboardSettingsForm
        data={data}
        onSave={handleDashboardSettingsUpdate}
      />
    </>
  );
}
