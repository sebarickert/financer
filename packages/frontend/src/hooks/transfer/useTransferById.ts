import { TransferDto } from '@local/types';
import { useQuery } from 'react-query';

import { getTransferById } from '../../services/TransferService';

export const useTransferById = (id = 'missing-id'): TransferDto => {
  const { data, error } = useQuery(
    ['transfers', `transfer-id-${id}`],
    () => getTransferById(id),

    {
      enabled: Boolean(id),
    }
  );
  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
