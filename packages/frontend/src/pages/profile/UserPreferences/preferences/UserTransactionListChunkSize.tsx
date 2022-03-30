import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
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
    <>
      <div className="bg-blue-financer -mx-6 -mt-8 text-center pt-6 pb-4 mb-6 px-6 relative">
        <NavLink
          to={'/profile/user-preferences'}
          className="absolute left-6 top-1/2 -translate-y-1/2 pt-2"
        >
          <span className="sr-only">Go back</span>
          <Icon
            type={'chevron-left'}
            className="stroke-white -translate-x-1/2"
          />
        </NavLink>
        <Heading
          variant="h1"
          className="!text-base !tracking-tight !text-white"
        >
          Transaction list chunk size
        </Heading>
      </div>
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
    </>
  );
};
