import { TransferDto } from '@local/types';
import { useQuery } from 'react-query';

import { getTransferById } from '../../services/TransferService';

export const useTransferById = (id = 'missing-id'): TransferDto => {
  const { data } = useQuery(
    ['transfers', `transfer-id-${id}`],
    () => getTransferById(id),

    {
      enabled: Boolean(id),
    }
  );
  return data ?? ({} as TransferDto);
};
