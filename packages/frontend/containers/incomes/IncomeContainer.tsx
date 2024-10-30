import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionDeletePopperItem } from '$blocks/TransactionDeletePopperItem';
import { Popper } from '$elements/Popper';
import { Layout } from '$layouts/Layout';
import { IncomeService } from '$ssr/api/income.service';
import { Transaction } from 'src/components/views/Transaction';

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
          ]}
        >
          <TransactionDeletePopperItem
            id={income.id}
            type={TransactionType.Income}
          />
        </Popper>
      }
    >
      <Transaction {...income} />
    </Layout>
  );
};
