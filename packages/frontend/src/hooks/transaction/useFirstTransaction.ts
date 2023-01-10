import { SortOrder } from '@local/types';

import {
  TransfersFindAllByUserApiArg,
  useTransfersFindAllByUserQuery,
} from '$api/generated/financerApi';

export const useFirstTransaction = (
  args: Omit<TransfersFindAllByUserApiArg, 'limit' | 'page' | 'sortOrder'> = {}
) => {
  const transactionData = useTransfersFindAllByUserQuery({
    ...args,
    limit: 1,
    page: 1,
    sortOrder: SortOrder.ASC,
  });

  return { ...transactionData, data: transactionData.data?.data[0] };
};
