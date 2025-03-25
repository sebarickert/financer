import { Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { Popper } from '@/elements/Popper';
import { TransactionDeleteDrawer } from '@/features/transaction/TransactionDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { IncomeService } from '@/ssr/api/IncomeService';
import { Transaction } from '@/views/Transaction';

type Params = Promise<{
  incomeId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { incomeId } = await params;
  const income = await IncomeService.getById(incomeId);

  return {
    title: income.description,
  };
};

export default async function IncomePage({ params }: { params: Params }) {
  const { incomeId } = await params;

  const income = await IncomeService.getById(incomeId);

  if (!income) {
    notFound();
  }

  return (
    <>
      <ContentHeader
        title="Income Details"
        backLink="/transactions"
        headerAction={
          <Popper
            items={[
              {
                href: `/transactions/${income.type.toLowerCase()}s/${incomeId}/edit`,
                Icon: Pencil,
                label: 'Edit',
              },
              {
                Icon: Trash,
                label: 'Delete',
                popperId: income.id,
              },
            ]}
          />
        }
      />
      <Transaction {...income} />
      <TransactionDeleteDrawer id={income.id} type={TransactionType.INCOME} />
    </>
  );
}
