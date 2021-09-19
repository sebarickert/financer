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
          Etiam egestas hendrerit orci sit amet porta. Nunc vulputate bibendum
          nulla, id pretium enim vehicula a. Integer vel rhoncus magna. Morbi
          metus nisi, fermentum eget vulputate sit amet, fermentum eget nulla.
        </p>
      </div>
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Incomes"
          link="/incomes"
          iconName="download"
          iconBackgroundColor="green"
          description="plaa"
        />
        <QuickLinksItem
          title="Expenses"
          link="/expenses"
          iconName="upload"
          iconBackgroundColor="red"
          description="plaa"
        />
      </QuickLinks>
    </>
  );
};

export default Statistics;
