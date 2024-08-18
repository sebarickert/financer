'use client';

import {
  useIncomesFindOneQuery,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Transaction } from '$blocks/transaction/transaction';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer = ({ id }: IncomeContainerProps) => {
  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: income?.toAccount as string },
    { skip: !income?.toAccount },
  );

  const account = accountData.data;

  return (
    <>
      <DataHandler {...incomeData} />
      {income && <Transaction transaction={income} toAccount={account?.name} />}
    </>
  );
};
