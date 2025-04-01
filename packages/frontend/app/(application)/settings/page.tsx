import { Activity, ChartNoAxesCombined, Grid2X2, Home } from 'lucide-react';
import { Metadata } from 'next';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsPaths } from '@/constants/settingsPaths';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <>
      <ContentHeader title="Settings" />
      <List>
        <ProminentLink
          link={`${settingsPaths.default}/dashboard-settings`}
          Icon={Home}
        >
          Dashboard Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/statistics-settings`}
          Icon={Activity}
        >
          Transactions & Statistics Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/default-account-settings`}
          Icon={Grid2X2}
        >
          Default Account Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.default}/market-update-settings`}
          Icon={ChartNoAxesCombined}
        >
          Market Update Settings
        </ProminentLink>
      </List>
    </>
  );
}
