import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { LinkList } from '$elements/LinkList/LinkList';
import { LinkListLink } from '$elements/LinkList/LinkListLink';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const UserPreferences: FC = () => {
  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.default} />
      <LinkList>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/dashboard-settings`}
          icon={'HomeIcon'}
        >
          Dashboard settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/statistics-settings`}
          icon={'ChartBarIcon'}
        >
          Statistics settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/default-account-settings`}
          icon={'Squares2X2Icon'}
        >
          Default account settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/maximum-items-per-page`}
          icon={'RectangleStackIcon'}
        >
          Max amount of items per page
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/market-update-settings`}
          icon={'ArrowTrendingUpIcon'}
        >
          Market update settings
        </LinkListLink>
      </LinkList>
    </>
  );
};
