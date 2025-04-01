import { Metadata } from 'next';

import { handleDashboardSettingsUpdate } from '@/actions/settings/handleDashboardSettingsUpdate';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserDashboardSettingsForm } from '@/views/user-preferences/UserDashboardSettingsForm';

export const metadata: Metadata = {
  title: 'Dashboard Settings',
};

export default async function DashboardSettingsUserPreferencePage() {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();
  const defaultChunkSize =
    await UserPreferenceService.getTransactionListChunkSize();

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
