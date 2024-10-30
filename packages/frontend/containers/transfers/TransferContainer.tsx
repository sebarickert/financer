import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { Layout } from '$layouts/Layout';
import { TransactionDeletePopperItem } from '$modules/transaction/TransactionDeletePopperItem';
import { TransferService } from '$ssr/api/transfer.service';
import { Transaction } from '$views/Transaction';

type TransferContainerProps = {
  id: string;
};

export const TransferContainer: FC<TransferContainerProps> = async ({ id }) => {
  const transfer = await TransferService.getById(id);

  return (
    <Layout
      title="Transfer Details"
      backLink="/statistics"
      headerAction={
        <Popper
          items={[
            {
              href: `/statistics/${transfer.type.toLowerCase()}s/${id}/edit`,
              icon: 'PencilIcon',
              label: 'Edit',
            },
          ]}
        >
          <TransactionDeletePopperItem
            id={transfer.id}
            type={TransactionType.Transfer}
          />
        </Popper>
      }
    >
      <Transaction {...transfer} />
    </Layout>
  );
};
