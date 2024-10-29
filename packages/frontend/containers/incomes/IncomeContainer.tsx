import { FC } from 'react';

import { Transaction } from '$blocks/Transaction';
import { TransactionDeletePopperItem } from '$blocks/TransactionDeletePopperItem';
import { Popper } from '$elements/Popper';
import { Layout } from '$layouts/Layout';
import { IncomeService } from '$ssr/api/income.service';

interface IncomeContainerProps {
  id: string;
}
export const IncomeContainer: FC<IncomeContainerProps> = async ({ id }) => {
  const income = await IncomeService.getById(id);

  return (
    <Layout
      title="Income Details"
      backLink="/statistics"
      headerAction={
        <Popper
          id="transactionPopper"
          items={[
            {
              href: `/statistics/${income.type.toLowerCase()}s/${id}/edit`,
              icon: 'PencilIcon',
              label: 'Edit',
            },
          ]}
        >
          <TransactionDeletePopperItem />
          {/* <div>asdasdasdasd !!!!!</div> */}
        </Popper>
      }
    >
      <Transaction {...income} />
    </Layout>
  );
};
