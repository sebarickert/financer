import React from 'react';

import { Banner } from '../../components/banner/banner';
import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DashboardStats } from '../../components/dashboard-stats/dashboard.stats';
import { SEO } from '../../components/seo/seo';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <SEO title="Dashboard" />
      <Banner title="Dashboard" headindType="h1" className="mb-8">
        <ButtonGroup>
          <Button accentColor="green" link="/statistics/incomes/add">
            Add income
          </Button>
          <Button accentColor="red" link="/statistics/expenses/add">
            Add expense
          </Button>
          <Button accentColor="blue" link="/statistics/transfers/add">
            Transfer
          </Button>
        </ButtonGroup>
      </Banner>
      <DashboardStats label="Current month" />
    </>
  );
};
