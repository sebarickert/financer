import { redirect, RedirectType } from 'next/navigation';

import { AccountType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const handleStatisticsPageSettingsUpdate: DefaultFormActionHandler =
  async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateStatisticsSettings({
      accountTypes: formData.getAll('accountTypes') as AccountType[],
    });

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };