import { Metadata } from 'next';
import { FC } from 'react';

import { EditExpenseContainer } from '$container/expenses/expense.edit.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Expense',
};

type EditExpensePageProps = {
  params: {
    expenseId: string;
  };
};

const EditExpensePage: FC<EditExpensePageProps> = ({
  params: { expenseId },
}) => {
  return (
    <Layout title="Edit Expense">
      <EditExpenseContainer id={expenseId} />
    </Layout>
  );
};

export default EditExpensePage;
