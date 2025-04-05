import { Activity, ChartNoAxesCombined, Grid2X2, Home } from 'lucide-react';
import { Metadata } from 'next';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsPaths } from '@/constants/settingsPaths';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { generateUserPreferenceViewTransitionName } from '@/features/settings/generateUserPreferenceViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  const settingsVtNames = generateUserPreferenceViewTransitionName();
  const vtNames = generateNavigationViewTransitionName();

  return (
    <>
      <ContentHeader title="Settings" titleVtName={vtNames.settings} />
      <List>
        <ProminentLink
          link={`${settingsPaths.default}/dashboard-settings`}
          Icon={Home}
          vtName={settingsVtNames.dashboard}
        >
          Dashboard Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/statistics-settings`}
          Icon={Activity}
          vtName={settingsVtNames.transactionsAndStatistics}
        >
          Transactions & Statistics Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/default-account-settings`}
          Icon={Grid2X2}
          vtName={settingsVtNames.defaultAccount}
        >
          Default Account Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/market-update-settings`}
          Icon={ChartNoAxesCombined}
          vtName={settingsVtNames.marketUpdate}
        >
          Market Update Settings
        </ProminentLink>
      </List>
    </>
  );
}
