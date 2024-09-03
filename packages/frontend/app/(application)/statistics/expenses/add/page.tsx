import { Metadata } from 'next';

import { ExpenseAddContainer } from '$container/expenses/expense.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Expense',
};

const AddExpensePage = () => {
  return (
    <Layout title="Add Expense">
      <ExpenseAddContainer />
    </Layout>
  );
};

export default AddExpensePage;
