import { settingsPaths } from '$constants/settings-paths';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo
        title="User preferences"
        backLink={settingsPaths.default}
      />
      <LinkList>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/dashboard-settings`}
          icon={IconName.home}
        >
          Dashboard settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/statistics-settings`}
          icon={IconName.chartBar}
        >
          Statistics settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/default-account-settings`}
          icon={IconName.viewGrid}
        >
          Default account settings
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/maximum-items-per-page`}
          icon={IconName.collection}
        >
          Max amount of items per page
        </LinkListLink>
        <LinkListLink
          link={`${settingsPaths.userPreferences}/market-update-settings`}
          icon={IconName.trendingUp}
        >
          Market update settings
        </LinkListLink>
      </LinkList>
    </>
  );
};
