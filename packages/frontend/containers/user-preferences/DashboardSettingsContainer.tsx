import { FC } from 'react';

import { handleDashboardSettingsUpdate } from '$actions/settings/handleDashboardSettingsUpdate';
import { settingsPaths } from '$constants/settingsPaths';
import { Layout } from '$layouts/Layout';
import { UserPreferenceService } from '$ssr/api/UserPreferenceService';
import { UserDashboardSettingsForm } from '$views/user-preferences/UserDashboardSettingsForm';

export const DashboardSettingsContainer: FC = async () => {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();
  const defaultChunkSize =
    await UserPreferenceService.getTransactionListChunkSize();

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
