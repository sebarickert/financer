import { Heading } from '../../../components/heading/heading';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="User preferences" backLink={'/profile'} />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        User preferences
      </Heading>
      <LinkList>
        <LinkListLink link="default-income-account" icon="download">
          Default income account
        </LinkListLink>
        <LinkListLink link="default-expense-account" icon="upload">
          Default expense account
        </LinkListLink>
        <LinkListLink
          link="default-transfer-source-account"
          icon="switch-horizontal"
        >
          Default transfer source account
        </LinkListLink>
        <LinkListLink
          link="default-transfer-target-account"
          icon="switch-horizontal"
        >
          Default transfer target account
        </LinkListLink>
        <LinkListLink link="transaction-list-chunk-size" icon="collection">
          Transaction list chunk size
        </LinkListLink>
        <LinkListLink link="market-update-settings" icon="trending-up">
          Market update settings
        </LinkListLink>
      </LinkList>
    </>
  );
};
