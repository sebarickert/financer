import { FC } from 'react';

import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const UserPreferences: FC = () => {
  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.default} />
      <List>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/dashboard-settings`}
          icon={'HomeIcon'}
        >
          Dashboard settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/statistics-settings`}
          icon={'ChartBarIcon'}
        >
          Statistics settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/default-account-settings`}
          icon={'Squares2X2Icon'}
        >
          Default account settings
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/maximum-items-per-page`}
          icon={'RectangleStackIcon'}
        >
          Max amount of items per page
        </ProminentLink>
        <ProminentLink
          link={`${settingsPaths.userPreferences}/market-update-settings`}
          icon={'ArrowTrendingUpIcon'}
        >
          Market update settings
        </ProminentLink>
      </List>
    </>
  );
};
