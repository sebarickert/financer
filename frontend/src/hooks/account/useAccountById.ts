import { useState } from 'react';

import { useAllAccounts } from './useAllAccounts';

export const useAccountById = (
  id: string | null = null
): [IAccount | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [targetId, setTargetId] = useState(id);
  const accounts = useAllAccounts();

  const targetAccount = !targetId
    ? null
    : accounts?.find(({ _id }) => _id === targetId) || null;

  return [targetAccount, setTargetId];
};
