import { Button } from '../../components/button/button';
import { Heading } from '../../components/heading/heading';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
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
      <QuickLinks>
        <QuickLinksItem
          title="User preferences"
          link="/profile/user-preferences"
          iconName="cog"
          description="Go to user preferences page where you are able to set available settings to your preference."
        />
        <QuickLinksItem
          title="Categories"
          link="/profile/transaction-categories"
          iconName="tag"
          description="Go to transaction categories page where you are able to manage or create them."
        />
        <QuickLinksItem
          title="Download your data"
          link="/api/users/my-user/my-data"
          iconName="cloud-download"
          description="Download your complete financer data as a JSON-file."
        />
        {profileInfo?.roles.includes('test-user') && (
          <QuickLinksItem
            title="Override data"
            link="/profile/override-data"
            iconName="exclamation"
            iconBackgroundColor="red"
            description="Go to override data page where you are able to override your current financer data."
          />
        )}
      </QuickLinks>
      <Button
        className="mt-4 !w-full lg:hidden"
        accentColor="plain"
        link="/auth/logout"
      >
        Sign out
      </Button>
    </>
  );
};
