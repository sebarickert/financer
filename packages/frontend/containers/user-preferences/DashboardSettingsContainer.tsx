import { FC } from 'react';

import { handleDashboardSettingsUpdate } from '$actions/settings/handleDashboardSettingsUpdate';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserDashboardSettingsForm } from '$views/user-preferences/UserDashboardSettingsForm';

export const DashboardSettingsContainer: FC = async () => {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();

  return (
    <Layout title="Dashboard Settings" backLink={settingsPaths.userPreferences}>
      <InfoMessageBlock
        title="Account Types"
        className="mb-6"
        variant="barebone"
      >
        The selected account types will determine the calculated numbers and
        charts on your dashboard.
      </InfoMessageBlock>
      <UserDashboardSettingsForm
        data={dashboardSettings}
        onSave={handleDashboardSettingsUpdate}
      />
    </Layout>
  );
};
