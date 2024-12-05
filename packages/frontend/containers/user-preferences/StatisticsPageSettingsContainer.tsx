import { FC } from 'react';

import { handleStatisticsPageSettingsUpdate } from '$actions/settings/handleStatisticsPageSettingsUpdate';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { settingsPaths } from '$constants/settings-paths';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserStatisticsPageSettingsForm } from '$views/user-preferences/UserStatisticsPageSettingsForm';

export const StatisticsPageSettingsContainer: FC = async () => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  return (
    <SettingsLayout
      title="Statistics Settings"
      backLink={settingsPaths.userPreferences}
    >
      <InfoMessageBlock
        title="Account Types"
        className="mb-6"
        variant="barebone"
      >
        The selected account types will determine the calculated numbers and
        charts on your statistics pages.
      </InfoMessageBlock>
      <UserStatisticsPageSettingsForm
        data={statisticsSettings}
        onSave={handleStatisticsPageSettingsUpdate}
      />
    </SettingsLayout>
  );
};
