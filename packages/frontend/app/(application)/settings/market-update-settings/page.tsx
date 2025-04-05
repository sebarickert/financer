import { Metadata } from 'next';

import { handleMarketSettingsUpdate } from '@/actions/settings/handleMarketSettingsUpdate';
import {
  getAllCategoriesWithTree,
  getDefaultMarketUpdateSettings,
} from '@/api-service';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserDefaultMarketUpdateSettingsForm } from '@/views/user-preferences/UserDefaultMarketUpdateSettingsForm';

export const metadata: Metadata = {
  title: 'Market Update Settings',
};

export default async function MarketUpdateSettingsUserPreferencePage() {
  const marketUpdateSettings = await getDefaultMarketUpdateSettings();

  const categories = await getAllCategoriesWithTree();

  return (
    <>
      <ContentHeader title="Market Update Settings" />
      <UserDefaultMarketUpdateSettingsForm
        data={marketUpdateSettings}
        categories={categories}
        onSave={handleMarketSettingsUpdate}
      />
    </>
  );
}
