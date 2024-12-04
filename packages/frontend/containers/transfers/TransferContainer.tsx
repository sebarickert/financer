import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { TransactionDeleteDrawer } from '$features/transaction/TransactionDeleteDrawer';
import { Layout } from '$layouts/Layout';
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
              Icon: Pencil,
              label: 'Edit',
            },
            {
              Icon: Trash,
              label: 'Delete',
              popperId: transfer.id,
            },
          ]}
        />
      }
    >
      <Transaction {...transfer} />
      <TransactionDeleteDrawer
        id={transfer.id}
        type={TransactionType.Transfer}
      />
    </Layout>
  );
};
