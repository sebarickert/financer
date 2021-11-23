import React from 'react';

import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { CtaBlock } from '../../components/cta-block/cta-block';
import { CtaBlockItem } from '../../components/cta-block/cta-block.item';
import { DashboardStats } from '../../components/dashboard-stats/dashboard.stats';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <SEO title="Dashboard" />
      <Banner
        title="Hello there."
        headindType="h1"
        className="pb-20 lg:pb-20 lg:pt-16 text-center"
      >
        <BannerText className="mx-auto max-w-sm">
          Keep yourself financially up-to-date with Financer by tracking your
          transactions.
        </BannerText>
      </Banner>
      <CtaBlock
        className="-translate-y-2/4 mx-auto"
        label="Quick transaction links"
      >
        <CtaBlockItem
          label="Income"
          iconName="download"
          link="/statistics/incomes/add"
          ariaLabel="Add new income transaction"
        />
        <CtaBlockItem
          label="Expense"
          iconName="upload"
          link="/statistics/expenses/add"
          ariaLabel="Add new expense transaction"
        />
        <CtaBlockItem
          label="Transfer"
          iconName="switch-horizontal"
          link="/statistics/transfers/add"
          ariaLabel="Add new transfer transaction"
        />
      </CtaBlock>
      <section className="grid gap-2">
        <DashboardStats />
        <QuickLinks className="mt-4">
          <QuickLinksItem
            title="Incomes"
            link="/statistics/incomes"
            iconName="download"
            iconBackgroundColor="green"
            description="Go to incomes page where you are able to manage your income transactions."
          />
          <QuickLinksItem
            title="Expenses"
            link="/statistics/expenses"
            iconName="upload"
            iconBackgroundColor="red"
            description="Go to expenses page where you are able to manage your expense transactions."
          />
          <QuickLinksItem
            title="Transfers"
            link="/statistics/transfers"
            iconName="switch-horizontal"
            description="Go to transfers page where you are able to manage your transfer transactions."
          />
        </QuickLinks>
      </section>
    </>
  );
};
