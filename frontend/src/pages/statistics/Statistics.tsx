import React from "react";
import QuickLinks from "../../components/quick-links/quick-links";
import QuickLinksItem from "../../components/quick-links/quick-links.item";
import SEO from "../../components/seo/seo";

const Statistics = (): JSX.Element => {
  return (
    <>
      <SEO title="Statistics" />
      <div className="p-8 rounded-lg shadow-lg bg-black-off text-white space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Statistics
        </h1>
        <p className="text-lg text-gray-300">
          Below you are able to review, edit or delete all your transactions.
          They are ordered by date (latest first). You can as well filter the
          list by transaction types, i.e. incomes and expenses.
        </p>
      </div>
      <QuickLinks className="mt-4">
        <QuickLinksItem
          title="Incomes"
          link="/incomes"
          iconName="download"
          iconBackgroundColor="green"
          description="On the incomes page you are able to review, edit or delete all your income transaction."
        />
        <QuickLinksItem
          title="Expenses"
          link="/expenses"
          iconName="upload"
          iconBackgroundColor="red"
          description="On the expenses page you are able to review, edit or delete all your income transaction."
        />
      </QuickLinks>
    </>
  );
};

export default Statistics;
