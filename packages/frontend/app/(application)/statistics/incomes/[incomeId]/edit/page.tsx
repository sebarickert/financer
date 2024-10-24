import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeEditContainer } from '$container/incomes/income.edit.container';
import { Layout } from '$layouts/Layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Income',
};

type EditIncomePageProps = {
  params: {
    incomeId: string;
  };
};

const EditIncomePage: FC<EditIncomePageProps> = ({ params: { incomeId } }) => {
  return (
    <Layout title="Edit Income">
      <IncomeEditContainer id={incomeId} />
    </Layout>
  );
};

export default EditIncomePage;
