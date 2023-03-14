import { useState } from 'react';

import { DialogConfirmCustom } from '../../../components/elements/dialog/confirm/dialog.confirm.custom';
import { Dialog } from '../../../components/elements/dialog/dialog';
import { IconName } from '../../../components/elements/icon/icon';
import { Input } from '../../../components/elements/input/input';
import { LinkListButton } from '../../../components/elements/link-list/link-list.button';
import { inputDateFormat } from '../../../utils/formatDate';

interface IAccountUpdateMarketValueModalProps {
  handleUpdate(newMarketValue: number, newDate: Date): void;
  currentValue: number;
}

export const AccountUpdateMarketValueModal = ({
  currentValue,
  handleUpdate,
}: IAccountUpdateMarketValueModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LinkListButton icon={IconName.trendingUp} handleClick={handleToggleOpen}>
        Update current market value
      </LinkListButton>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirmCustom
          onCancel={handleToggleOpen}
          onConfirm={() => handleUpdate(newMarketValue, newDate)}
          submitButtonLabel="Update"
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
            >
              Date
            </Input>
          </div>
        </DialogConfirmCustom>
      </Dialog>
    </>
  );
};
