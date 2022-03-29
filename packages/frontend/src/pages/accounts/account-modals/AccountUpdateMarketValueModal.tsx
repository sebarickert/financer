import { useState } from 'react';

import { Input } from '../../../components/input/input';
import { ModalCustom } from '../../../components/modal/custom/modal.custom';

interface IAccountUpdateMarketValueModalProps {
  handleUpdate(newMarketValue: number): void;
  currentValue: number;
}

export const AccountUpdateMarketValueModal = ({
  currentValue,
  handleUpdate,
}: IAccountUpdateMarketValueModalProps) => {
  const [newMarketValue, setNewMarketValue] = useState(currentValue);

  const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMarketValue(Number(event.target.value));
  };

  return (
    <ModalCustom
      submitButtonLabel="Update"
      modalOpenButtonLabel="Update current market value"
      onConfirm={() => handleUpdate(newMarketValue)}
    >
      <Input
        id="currentMarketValue"
        type="number"
        isRequired
        value={currentValue}
        onChange={handleInputUpdate}
      >
        Current market value
      </Input>
    </ModalCustom>
  );
};
