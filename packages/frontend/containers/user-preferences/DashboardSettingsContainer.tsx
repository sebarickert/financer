import { FC } from 'react';

import { handleDashboardSettingsUpdate } from '@/actions/settings/handleDashboardSettingsUpdate';
import {
  getDashboardSettings,
  getTransactionListChunkSize,
} from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { Layout } from '@/layouts/Layout';
import { UserDashboardSettingsForm } from '@/views/user-preferences/UserDashboardSettingsForm';

export const DashboardSettingsContainer: FC = async () => {
  const dashboardSettings = await getDashboardSettings();
  const defaultChunkSize = await getTransactionListChunkSize();

  const data = {
    accountTypes: dashboardSettings?.accountTypes,
    chunkSize: defaultChunkSize,
  };

  return (
    <Layout title="Dashboard Settings" backLink={settingsPaths.userPreferences}>
      <UserDashboardSettingsForm
        data={data}
        onSave={handleDashboardSettingsUpdate}
      />
    </Layout>
  );
};
