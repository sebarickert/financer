import { IconName } from '../../../components/elements/icon/icon';
import { LinkList } from '../../../components/elements/link-list/link-list';
import { LinkListLink } from '../../../components/elements/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/renderers/seo/updatePageInfo';

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="User preferences" backLink={'/profile'} />
      <LinkList>
        <LinkListLink link="dashboard-settings" icon={IconName.home}>
          Dashboard settings
        </LinkListLink>
        <LinkListLink link="statistics-settings" icon={IconName.chartBar}>
          Statistics settings
        </LinkListLink>
        <LinkListLink link="default-account-settings" icon={IconName.viewGrid}>
          Default account settings
        </LinkListLink>
        <LinkListLink link="maximum-items-per-page" icon={IconName.collection}>
          Max amount of items per page
        </LinkListLink>
        <LinkListLink link="market-update-settings" icon={IconName.trendingUp}>
          Market update settings
        </LinkListLink>
      </LinkList>
    </>
  );
};
