import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { TransactionDeleteDrawer } from '$features/transaction/TransactionDeleteDrawer';
import { Layout } from '$layouts/Layout';
import { ExpenseService } from '$ssr/api/ExpenseService';
import { Transaction } from '$views/Transaction';

type ExpenseContainerProps = {
  id: string;
};

export const ExpenseContainer: FC<ExpenseContainerProps> = async ({ id }) => {
  const expense = await ExpenseService.getById(id);

  return (
    <Layout
      title="Expense Details"
      backLink="/statistics"
      headerAction={
        <Popper
          items={[
            {
              href: `/statistics/${expense.type.toLowerCase()}s/${id}/edit`,
              Icon: Pencil,
              label: 'Edit',
            },
            {
              Icon: Trash,
              label: 'Delete',
              popperId: expense.id,
            },
          ]}
        />
      }
    >
      <Transaction {...expense} />
      <TransactionDeleteDrawer id={expense.id} type={TransactionType.Expense} />
    </Layout>
  );
};
