import { Heading } from '../../components/heading/heading';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

export const Profile = (): JSX.Element => {
  const profileInfo = useProfileInformation();

  return (
    <>
      <UpdatePageInfo title="Profile" />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        Profile
      </Heading>
      <LinkList>
        <LinkListLink link="/profile/user-preferences" icon="cog">
          User preferences
        </LinkListLink>
        <LinkListLink link="/profile/transaction-categories" icon="tag">
          Categories
        </LinkListLink>
        <LinkListLink link="/api/users/my-user/my-data" icon="cloud-download">
          Download your data
        </LinkListLink>
        {profileInfo?.roles.includes('test-user') && (
          <LinkListLink link="/profile/override-data" icon="exclamation">
            Override data
          </LinkListLink>
        )}
        <LinkListLink link="/auth/logout" icon="logout" className="lg:hidden">
          Sign out
        </LinkListLink>
      </LinkList>
    </>
  );
};
