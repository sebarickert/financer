import { Metadata } from 'next';
import { FC } from 'react';

import { ExpenseAddContainer } from '$container/expenses/expense.add.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Add Expense',
};

type ExpenseAddWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const ExpenseAddWithTemplateIdPage: FC<ExpenseAddWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return (
    <Layout title="Add Expense">
      <ExpenseAddContainer templateId={templateId} />
    </Layout>
  );
};

export default ExpenseAddWithTemplateIdPage;
