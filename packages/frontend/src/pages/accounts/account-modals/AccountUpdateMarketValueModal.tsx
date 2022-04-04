import { useState } from 'react';

import { Input } from '../../../components/input/input';
import { LinkListButton } from '../../../components/link-list/link-list.button';
import { ModalCustomActions } from '../../../components/modal/custom/modal.custom.actions';
import { ModalCustomContent } from '../../../components/modal/custom/modal.custom.content';
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
      <LinkListButton icon="trash" handleClick={handleToggleOpen}>
        Update current market value
      </LinkListButton>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <div
            className={`flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0 pb-[calc(78px+env(safe-area-inset-bottom))]`}
          >
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block w-full max-w-lg overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <ModalCustomContent>
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
              </ModalCustomContent>
              <ModalCustomActions
                submitButtonLabel="Update"
                onCancel={handleToggleOpen}
                onConfirm={() => handleUpdate(newMarketValue, newDate)}
                submitButtonAccentColor={'blue'}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
