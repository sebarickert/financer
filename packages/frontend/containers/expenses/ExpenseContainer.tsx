import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { Layout } from '$layouts/Layout';
import { TransactionDeletePopperItem } from '$modules/transaction/TransactionDeletePopperItem';
import { ExpenseService } from '$ssr/api/expense.service ';
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
              icon: 'PencilIcon',
              label: 'Edit',
            },
          ]}
        >
          <TransactionDeletePopperItem
            id={expense.id}
            type={TransactionType.Expense}
          />
        </Popper>
      }
    >
      <Transaction {...expense} />
    </Layout>
  );
};
