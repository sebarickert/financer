import { FC } from 'react';

import { Transaction } from '$blocks/transaction/transaction';
import { AccountService } from '$ssr/api/account.service';
import { TransferService } from '$ssr/api/transfer.service';

interface TransferContainerProps {
  id: string;
}

export const TransferContainer: FC<TransferContainerProps> = async ({ id }) => {
  const transfer = await TransferService.getById(id);

  const [fromAccount, toAccount] = await Promise.all([
    AccountService.getById(transfer.fromAccount),
    AccountService.getById(transfer.toAccount),
  ]);

  return (
    <Transaction
      transaction={transfer}
      fromAccount={fromAccount?.name}
      toAccount={toAccount?.name}
    />
  );
};
