import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { TransactionDeleteDrawer } from '$features/transaction/TransactionDeleteDrawer';
import { Layout } from '$layouts/Layout';
import { IncomeService } from '$ssr/api/income.service';
import { Transaction } from '$views/Transaction';

type IncomeContainerProps = {
  id: string;
};

export const IncomeContainer: FC<IncomeContainerProps> = async ({ id }) => {
  const income = await IncomeService.getById(id);

  return (
    <Layout
      title="Income Details"
      backLink="/statistics"
      headerAction={
        <Popper
          items={[
            {
              href: `/statistics/${income.type.toLowerCase()}s/${id}/edit`,
              icon: 'PencilIcon',
              label: 'Edit',
            },
            {
              icon: 'TrashIcon',
              label: 'Delete',
              popperId: income.id,
            },
          ]}
        />
      }
    >
      <Transaction {...income} />
      <TransactionDeleteDrawer id={income.id} type={TransactionType.Income} />
    </Layout>
  );
};
