import { RoleEnum } from '$api/generated/financerApi';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface ProfileProps {
  roles?: RoleEnum[];
}

export const Profile = ({ roles }: ProfileProps): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Profile" />
      <LinkList>
        <LinkListLink link="/profile/user-preferences" icon={IconName.cog}>
          User preferences
        </LinkListLink>
        <LinkListLink
          link="/profile/transaction-categories"
          icon={IconName.tag}
        >
          Categories
        </LinkListLink>
        <LinkListLink
          link="/profile/transaction-templates"
          icon={IconName.lightningBolt}
        >
          Templates
        </LinkListLink>
        <LinkListLink
          link="/api/users/my-user/my-data"
          icon={IconName.cloudDownload}
        >
          Download your data
        </LinkListLink>
        {roles?.includes(RoleEnum.TestUser) && (
          <LinkListLink
            link="/profile/override-data"
            icon={IconName.exclamation}
          >
            Override data
          </LinkListLink>
        )}
        <LinkListLink
          link="/auth/logout"
          icon={IconName.logout}
          className="lg:hidden"
        >
          Sign out
        </LinkListLink>
      </LinkList>
    </>
  );
};