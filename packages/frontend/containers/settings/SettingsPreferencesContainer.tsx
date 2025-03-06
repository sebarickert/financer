import { Activity, ChartNoAxesCombined, Grid2X2, Home } from 'lucide-react';
import { FC } from 'react';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsPaths } from '@/constants/settingsPaths';
import { SettingsLayout } from '@/features/settings/SettingsLayout';

export const SettingsPreferencesContainer: FC = () => {
  return (
    <SettingsLayout title="Preferences">
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
    </SettingsLayout>
  );
};
