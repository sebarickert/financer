import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserStatisticsSettings } from '$views/settings/user-preferences/preferences/user-statistics-settings';

export const StatisticsSettingsContainer: FC = async () => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  const handleSave: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateStatisticsSettings({
      accountTypes: formData.getAll('accountTypes') as AccountType[],
    });

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };

  return (
    <UserStatisticsSettings data={statisticsSettings} onSave={handleSave} />
  );
};
