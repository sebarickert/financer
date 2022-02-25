import { Button } from '../../components/button/button';
import { Heading } from '../../components/heading/heading';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';
import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

export const Profile = (): JSX.Element => {
  const profileInfo = useProfileInformation();

  return (
    <>
      <SEO title="Profile" />
      <Heading variant="h1" className="mb-6">
        Profile
      </Heading>
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Categories"
          link="/profile/transaction-categories"
          iconName="tag"
          description="Go to transaction categories page where you are able to manage or create them."
        />
        <QuickLinksItem
          title="Download your data"
          link="/api/profile/my-data"
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
