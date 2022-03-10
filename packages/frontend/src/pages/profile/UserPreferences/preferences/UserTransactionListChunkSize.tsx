import { useState } from 'react';

import { Input } from '../../../../components/input/input';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { useUserTransactionListChunkSize } from '../../../../hooks/profile/user-preference/useUserTransactionListChunkSize';

export const UserTransactionListChunkSize = (): JSX.Element => {
  const [chunkSize, setChunkSize] = useState(5);
  const [defaultChunkSize, setDefaultChunkSize] =
    useUserTransactionListChunkSize();

  const handleChunkSizeInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChunkSize(Number(event.target.value));
  };

  const handleSave = () => {
    setDefaultChunkSize(chunkSize);
  };

  return (
    <ModalCustom
      modalOpenButtonLabel="Set transaction list chunk size"
      onConfirm={handleSave}
      submitButtonLabel="Save"
    >
      <Input
        id="chunkSize"
        type="number"
        min={3}
        step={1}
        max={100}
        isRequired
        value={defaultChunkSize}
        onChange={handleChunkSizeInputValueChange}
      >
        Transaction list chunk size
      </Input>
    </ModalCustom>
  );
};
