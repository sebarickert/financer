'use client';

import { settingsPaths } from '$constants/settings-paths';
import {
  useUserStatisticsSettings,
  useUpdateUserStatisticsSettings,
} from '$hooks/settings/user-preference/useStatisticsSettings';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserStatisticsSettings,
  UserStatisticsSettingsFormFields,
} from '$views/settings/user-preferences/preferences/user-statistics-settings';

export const StatisticsSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data } = useUserStatisticsSettings();
  const [setStatisticsSettings] = useUpdateUserStatisticsSettings();

  const handleSave = async (
    newUserStatisticsData: UserStatisticsSettingsFormFields,
  ) => {
    await setStatisticsSettings({
      accountTypes: newUserStatisticsData.accountTypes,
    });

    push(settingsPaths.userPreferences);
  };

  return <UserStatisticsSettings data={data} onSave={handleSave} />;
};
