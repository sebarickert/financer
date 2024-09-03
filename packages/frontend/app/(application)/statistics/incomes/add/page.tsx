import { Metadata } from 'next';

import { IncomeAddContainer } from '$container/incomes/income.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Income',
};

const IncomeAddPage = () => {
  return (
    <Layout title="Add Income">
      <IncomeAddContainer />
    </Layout>
  );
};

export default IncomeAddPage;
