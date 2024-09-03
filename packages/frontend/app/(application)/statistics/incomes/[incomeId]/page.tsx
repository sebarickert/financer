import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeContainer } from '$container/incomes/income.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Income Details',
};

type IncomePageProps = {
  params: {
    incomeId: string;
  };
};

const IncomePage: FC<IncomePageProps> = ({ params: { incomeId } }) => {
  return (
    <Layout title="Income Details">
      <IncomeContainer id={incomeId} />
    </Layout>
  );
};

export default IncomePage;
