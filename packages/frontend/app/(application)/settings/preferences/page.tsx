import { Activity, ChartNoAxesCombined, Grid2X2, Home } from 'lucide-react';
import { Metadata } from 'next';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsContextualNavigationItems } from '@/constants/settingsContextualNavigationItems';
import { settingsPaths } from '@/constants/settingsPaths';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Preferences',
};

export default function SettingsPreferencesPage() {
  return (
    <>
      <ContentHeader
        title="Preferences"
        contextualNavigationItems={settingsContextualNavigationItems}
      />
      <List>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/dashboard-settings`}
          Icon={Home}
        >
          Dashboard Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/statistics-settings`}
          Icon={Activity}
        >
          Transactions & Statistics Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/default-account-settings`}
          Icon={Grid2X2}
        >
          Default Account Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/market-update-settings`}
          Icon={ChartNoAxesCombined}
        >
          Market Update Settings
        </ProminentLink>
      </List>
    </>
  );
}
