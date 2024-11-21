import { FC } from 'react';

import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';

export const UserPreferencesContainer: FC = () => {
  return (
    <Layout title="User Preferences" backLink={settingsPaths.default}>
      <List>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/dashboard-settings`}
          icon={'HomeIcon'}
        >
          Dashboard Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/statistics-settings`}
          icon={'ChartBarIcon'}
        >
          Statistics Page Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/default-account-settings`}
          icon={'Squares2X2Icon'}
        >
          Default Account Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/maximum-items-per-page`}
          icon={'RectangleStackIcon'}
        >
          Maximum Items Per Page Settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/market-update-settings`}
          icon={'ArrowTrendingUpIcon'}
        >
          Market Update Settings
        </ProminentLink>
      </List>
    </Layout>
  );
};
