import { Role } from '@local/types';

import { IconName } from '../../components/icon/icon';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

export const Profile = (): JSX.Element => {
  const profileInfo = useProfileInformation();

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
        {profileInfo?.roles.includes(Role.testUser) && (
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
