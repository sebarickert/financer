import React from "react";
import Banner from "../../components/banner/banner";
import QuickLinks from "../../components/quick-links/quick-links";
import QuickLinksItem from "../../components/quick-links/quick-links.item";
import SEO from "../../components/seo/seo";

const Statistics = (): JSX.Element => {
  return (
    <>
      <SEO title="Statistics" />
      <Banner title="Statistics" headindType="h1">
        Manage all your transactions in one place - review, edit or delete.
      </Banner>
      <QuickLinks className="mt-4">
        <QuickLinksItem
          title="Incomes"
          link="/incomes"
          iconName="download"
          iconBackgroundColor="green"
          description="Go to incomes page where you are able to manage your income transactions."
        />
        <QuickLinksItem
          title="Expenses"
          link="/expenses"
          iconName="upload"
          iconBackgroundColor="red"
          description="Go to expenses page where you are able to manage your expense transactions."
        />
      </QuickLinks>
    </>
  );
};

export default Statistics;
