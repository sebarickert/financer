import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserDashboardSettings } from '$views/settings/user-preferences/preferences/user-dashboard-settings';

export const DashboardSettingsContainer: FC = async () => {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();

  const handleSave: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateDashboardSettings({
      accountTypes: formData.getAll('accountTypes') as AccountType[],
    });

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };

  return <UserDashboardSettings data={dashboardSettings} onSave={handleSave} />;
};
