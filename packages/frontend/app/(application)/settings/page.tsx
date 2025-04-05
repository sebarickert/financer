import { Activity, ChartNoAxesCombined, Grid2X2, Home } from 'lucide-react';
import { Metadata } from 'next';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsPaths } from '@/constants/settingsPaths';
import { generateUserPreferenceViewTransitionName } from '@/features/settings/generateUserPreferenceViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  const dashboardVtNames =
    generateUserPreferenceViewTransitionName('dashboard');
  const transactionsVtNames = generateUserPreferenceViewTransitionName(
    'transactions-and-statistics',
  );
  const defaultAccountVtNames =
    generateUserPreferenceViewTransitionName('default-account');
  const marketUpdateVtNames =
    generateUserPreferenceViewTransitionName('market-update');
  const vtNames = {
    dashboard: dashboardVtNames.title,
    transactions: transactionsVtNames.title,
    defaultAccount: defaultAccountVtNames.title,
    marketUpdate: marketUpdateVtNames.title,
  };

  return (
    <>
      <ContentHeader title="Settings" />
      <List>
        <ProminentLink
          link={`${settingsPaths.default}/dashboard-settings`}
          Icon={Home}
          vtName={vtNames.dashboard}
        >
          Dashboard Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/statistics-settings`}
          Icon={Activity}
          vtName={vtNames.transactions}
        >
          Transactions & Statistics Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/default-account-settings`}
          Icon={Grid2X2}
          vtName={vtNames.defaultAccount}
        >
          Default Account Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/market-update-settings`}
          Icon={ChartNoAxesCombined}
          vtName={vtNames.marketUpdate}
        >
          Market Update Settings
        </ProminentLink>
      </List>
    </>
  );
}
