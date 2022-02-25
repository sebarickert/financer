import { useState, useEffect } from 'react';

import { useAllAccounts } from './useAllAccounts';

export const useAccountById = (
  id: string | null = null
): [IAccount | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [targetId, setTargetId] = useState(id);
  const [targetAccount, setTargetAccount] = useState<IAccount | null>(null);
  const accounts = useAllAccounts();

  useEffect(() => {
    setTargetAccount(accounts?.find(({ _id }) => _id === targetId) || null);
  }, [targetId, accounts]);

  return [targetAccount, setTargetId];
};
