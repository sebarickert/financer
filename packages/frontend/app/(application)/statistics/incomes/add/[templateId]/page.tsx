import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeAddContainer } from '$container/incomes/income.add.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Add Income',
};

type AddIncomeWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const AddIncomeWithTemplateIdPage: FC<AddIncomeWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return (
    <Layout title="Add Income">
      <IncomeAddContainer templateId={templateId} />
    </Layout>
  );
};

export default AddIncomeWithTemplateIdPage;
