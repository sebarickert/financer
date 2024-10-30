import { FC } from 'react';

import { handleStatisticsPageSettingsUpdate } from '$actions/settings/handleStatisticsPageSettingsUpdate';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserStatisticsPageSettingsForm } from '$views/user-preferences/UserStatisticsPageSettingsForm';

export const StatisticsPageSettingsContainer: FC = async () => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  return (
    <Layout
      title="Statistics Settings"
      backLink={settingsPaths.userPreferences}
    >
      <UserStatisticsPageSettingsForm
        data={statisticsSettings}
        onSave={handleStatisticsPageSettingsUpdate}
      />
    </Layout>
  );
};
