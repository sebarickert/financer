import { Metadata } from 'next';

import { handleMarketSettingsUpdate } from '@/actions/settings/handleMarketSettingsUpdate';
import { ContentHeader } from '@/layouts/ContentHeader';
import { CategoryService } from '@/ssr/api/CategoryService';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserDefaultMarketUpdateSettingsForm } from '@/views/user-preferences/UserDefaultMarketUpdateSettingsForm';

export const metadata: Metadata = {
  title: 'Market Update Settings',
};

export default async function MarketUpdateSettingsUserPreferencePage() {
  const marketUpdateSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();

  const categories = await CategoryService.getAllWithTree();

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
