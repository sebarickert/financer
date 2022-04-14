import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="User preferences" backLink={'/profile'} />
      <LinkList>
        <LinkListLink link="default-income-account" icon={IconName.download}>
          Default income account
        </LinkListLink>
        <LinkListLink link="default-expense-account" icon={IconName.upload}>
          Default expense account
        </LinkListLink>
        <LinkListLink
          link="default-transfer-source-account"
          icon={IconName.switchHorizontal}
        >
          Default transfer source account
        </LinkListLink>
        <LinkListLink
          link="default-transfer-target-account"
          icon={IconName.switchHorizontal}
        >
          Default transfer target account
        </LinkListLink>
        <LinkListLink
          link="transaction-list-chunk-size"
          icon={IconName.collection}
        >
          Transaction list chunk size
        </LinkListLink>
        <LinkListLink link="market-update-settings" icon={IconName.trendingUp}>
          Market update settings
        </LinkListLink>
      </LinkList>
    </>
  );
};
