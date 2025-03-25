import { Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { Popper } from '@/elements/Popper';
import { TransactionDeleteDrawer } from '@/features/transaction/TransactionDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { TransferService } from '@/ssr/api/TransferService';
import { Transaction } from '@/views/Transaction';

type Params = Promise<{
  transferId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { transferId } = await params;
  const transfer = await TransferService.getById(transferId);

  return {
    title: transfer.description,
  };
};

export default async function TransfersPage({ params }: { params: Params }) {
  const { transferId } = await params;

  const transfer = await TransferService.getById(transferId);

  if (!transfer) {
    notFound();
  }

  return (
    <>
      <ContentHeader
        title="Transfer Details"
        backLink="/transactions"
        headerAction={
          <Popper
            items={[
              {
                href: `/transactions/${transfer.type.toLowerCase()}s/${transferId}/edit`,
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
      />
      <Transaction {...transfer} />
      <TransactionDeleteDrawer
        id={transfer.id}
        type={TransactionType.TRANSFER}
      />
    </>
  );
}
