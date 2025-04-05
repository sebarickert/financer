import { Metadata } from 'next';

import { handleMarketSettingsUpdate } from '@/actions/settings/handleMarketSettingsUpdate';
import {
  getAllCategoriesWithTree,
  getDefaultMarketUpdateSettings,
} from '@/api-service';
import { generateUserPreferenceViewTransitionName } from '@/features/settings/generateUserPreferenceViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserDefaultMarketUpdateSettingsForm } from '@/views/user-preferences/UserDefaultMarketUpdateSettingsForm';

export const metadata: Metadata = {
  title: 'Market Update Settings',
};

export default async function MarketUpdateSettingsUserPreferencePage() {
  const marketUpdateSettings = await getDefaultMarketUpdateSettings();

  const categories = await getAllCategoriesWithTree();

  const vtNames = generateUserPreferenceViewTransitionName('market-update');

  return (
    <>
      <ContentHeader
        title="Market Update Settings"
        titleVtName={vtNames.title}
      />
      <UserDefaultMarketUpdateSettingsForm
        data={marketUpdateSettings}
        categories={categories}
        onSave={handleMarketSettingsUpdate}
      />
    </>
  );
}
