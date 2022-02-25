import { useState, useEffect } from 'react';

import { useAllTransfers } from './useAllTransfers';

export const useTransferById = (
  id: string | null = null
): [
  ITransaction | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const [targetTransfer, setTargetTransfer] = useState<ITransaction | null>(
    null
  );
  const transfers = useAllTransfers();

  useEffect(() => {
    setTargetTransfer(transfers?.find(({ _id }) => _id === targetId) || null);
  }, [targetId, transfers]);

  return [targetTransfer, setTargetId];
};
