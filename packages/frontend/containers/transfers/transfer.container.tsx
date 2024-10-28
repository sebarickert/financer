import { FC } from 'react';

import { Transaction } from '$blocks/Transaction';
import { TransferService } from '$ssr/api/transfer.service';

interface TransferContainerProps {
  id: string;
}

export const TransferContainer: FC<TransferContainerProps> = async ({ id }) => {
  const transfer = await TransferService.getById(id);

  return <Transaction {...transfer} />;
};
