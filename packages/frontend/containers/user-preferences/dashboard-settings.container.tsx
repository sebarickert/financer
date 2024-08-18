'use client';

import { settingsPaths } from '$constants/settings-paths';
import {
  useUserDashboardSettings,
  useUpdateUserDashboardSettings,
} from '$hooks/settings/user-preference/useDashboardSettings';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserDashboardSettings,
  UserDashboardSettingsFormFields,
} from '$views/settings/user-preferences/preferences/user-dashboard-settings';

export const DashboardSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data } = useUserDashboardSettings();
  const [setDashboardSettings] = useUpdateUserDashboardSettings();

  const handleSave = async (
    newUserDashboardData: UserDashboardSettingsFormFields,
  ) => {
    await setDashboardSettings({
      accountTypes: newUserDashboardData.accountTypes,
    });

    push(settingsPaths.userPreferences);
  };

  return <UserDashboardSettings data={data} onSave={handleSave} />;
};
