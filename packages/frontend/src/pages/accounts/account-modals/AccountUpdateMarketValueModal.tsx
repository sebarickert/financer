import { useState } from 'react';

import { Input } from '../../../components/input/input';
import { ModalCustom } from '../../../components/modal/custom/modal.custom';
import { inputDateFormat } from '../../../utils/formatDate';

interface IAccountUpdateMarketValueModalProps {
  handleUpdate(newMarketValue: number, newDate: Date): void;
  currentValue: number;
}

export const AccountUpdateMarketValueModal = ({
  currentValue,
  handleUpdate,
}: IAccountUpdateMarketValueModalProps) => {
  const [newMarketValue, setNewMarketValue] = useState(currentValue);
  const [newDate, setNewDate] = useState(new Date());

  const handleMarketValueInputUpdate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMarketValue(Number(event.target.value));
  };

  const handleDateInputUpdate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDate(new Date(event.target.value));
  };

  return (
    <ModalCustom
      submitButtonLabel="Update"
      modalOpenButtonLabel="Update current market value"
      onConfirm={() => handleUpdate(newMarketValue, newDate)}
    >
      <div className="space-y-4">
        <Input
          id="currentMarketValue"
          type="number"
          isRequired
          value={currentValue}
          onChange={handleMarketValueInputUpdate}
        >
          Current market value
        </Input>
        <Input
          id="date"
          type="datetime-local"
          value={inputDateFormat(new Date())}
          onChange={handleDateInputUpdate}
          isDate
        >
          Date
        </Input>
      </div>
    </ModalCustom>
  );
};
