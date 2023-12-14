import {
  useTransfersFindOneQuery,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Transaction } from '$renderers/transaction/transaction';

interface TransferContainerProps {
  id: string;
}

export const TransferContainer = ({ id }: TransferContainerProps) => {
  const transferData = useTransfersFindOneQuery({ id });
  const { data: transfer } = transferData;

  const fromAccountData = useAccountsFindOneByIdQuery(
    { id: transfer?.fromAccount as string },
    { skip: !transfer?.fromAccount }
  );
  const toAccountData = useAccountsFindOneByIdQuery(
    { id: transfer?.toAccount as string },
    { skip: !transfer?.toAccount }
  );
  const fromAccount = toAccountData.data;
  const toAccount = fromAccountData.data;

  return (
    <>
      <DataHandler {...transferData} />
      {transfer && (
        <Transaction
          transaction={transfer}
          fromAccount={fromAccount?.name}
          toAccount={toAccount?.name}
        />
      )}
    </>
  );
};
