import { Menu, Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getTransactionById } from '@/api-service';
import { Popper } from '@/elements/Popper';
import { PopperItem } from '@/elements/PopperItem';
import { TransactionDeleteDrawer } from '@/features/transaction/TransactionDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Transaction } from '@/views/Transaction';

type Params = Promise<{
  id: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { id } = await params;
  const transaction = await getTransactionById(id);

  return {
    title: transaction.description,
  };
};

export default async function TransactionPage({ params }: { params: Params }) {
  const { id } = await params;

  const transaction = await getTransactionById(id);

  if (!transaction) {
    notFound();
  }

  return (
    <>
      <ContentHeader
        title={transaction.description}
        action={
          <Popper
            popperButton={{
              isPill: true,
              size: 'small',
              accentColor: 'secondary',
              content: (
                <>
                  <Menu />
                  Options
                </>
              ),
            }}
          >
            <PopperItem
              label="Edit"
              href={`/transactions/${id}/edit`}
              icon={Pencil}
            />
            <PopperItem label="Delete" icon={Trash} popperId={id} />
          </Popper>
        }
      />
      <Transaction {...transaction} />
      <TransactionDeleteDrawer id={id} type={transaction.type} />
    </>
  );
}
