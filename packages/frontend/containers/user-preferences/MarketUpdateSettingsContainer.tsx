import { FC } from 'react';

import { handleMarketSettingsUpdate } from '@/actions/settings/handleMarketSettingsUpdate';
import {
  getAllCategoriesWithTree,
  getDefaultMarketUpdateSettings,
} from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { Layout } from '@/layouts/Layout';
import { UserDefaultMarketUpdateSettingsForm } from '@/views/user-preferences/UserDefaultMarketUpdateSettingsForm';

export const MarketUpdateSettingsContainer: FC = async () => {
  const marketUpdateSettings = await getDefaultMarketUpdateSettings();

  const categories = await getAllCategoriesWithTree();

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
