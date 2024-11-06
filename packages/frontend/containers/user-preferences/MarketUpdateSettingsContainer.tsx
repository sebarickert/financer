import { FC } from 'react';

import { handleMarketSettingsUpdate } from '$actions/settings/handleMarketSettingsUpdate';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/category.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserDefaultMarketUpdateSettingsForm } from '$views/user-preferences/UserDefaultMarketUpdateSettingsForm';

export const MarketUpdateSettingsContainer: FC = async () => {
  const marketUpdateSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();

  const categories = await CategoryService.getAllWithTree();

  return (
    <Layout
      title="Market Update Settings"
      backLink={settingsPaths.userPreferences}
    >
      <UserDefaultMarketUpdateSettingsForm
        data={marketUpdateSettings}
        categories={categories}
        onSave={handleMarketSettingsUpdate}
      />
    </Layout>
  );
};