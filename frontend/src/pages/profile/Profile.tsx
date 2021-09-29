import React from "react";
import Banner from "../../components/banner/banner";
import BannerText from "../../components/banner/banner.text";
import Button from "../../components/button/button";
import QuickLinks from "../../components/quick-links/quick-links";
import QuickLinksItem from "../../components/quick-links/quick-links.item";
import SEO from "../../components/seo/seo";

interface IProfileProps {
  profileInfo: IUser | null;
}

const Profile = ({ profileInfo }: IProfileProps): JSX.Element => {
  return (
    <>
      <SEO title="Profile" />
      <Banner title="Profile" headindType="h1">
        <BannerText>
          Manage transaction categories associated with your account and
          download your financer data.
        </BannerText>
      </Banner>
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
        {profileInfo?.roles.includes("test-user") && (
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

export default Profile;
