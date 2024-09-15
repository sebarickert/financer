import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/category.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserDefaultMarketUpdateSettings } from '$views/settings/user-preferences/preferences/user-default-market-update-settings';

export const MarketUpdateSettingsContainer: FC = async () => {
  const marketUpdateSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();

  const categories = await CategoryService.getAllWithTree();

  const handleSave: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateDefaultMarketUpdateSettings({
      transactionDescription: formData.get('transactionDescription') as string,
      category: formData.get('category') as string,
    });

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };

  return (
    <UserDefaultMarketUpdateSettings
      data={marketUpdateSettings}
      categories={categories}
      onSave={handleSave}
    />
  );
};
