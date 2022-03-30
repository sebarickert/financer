import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Loader } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultTransferTargetAccount } from '../../../../hooks/profile/user-preference/useUserDefaultTransferTargetAccount';

export const UserDefaultTransferTargetAccount = (): JSX.Element => {
  const accounts = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultTransferTargetAccount, setDefaultTransferTargetAccount] =
    useUserDefaultTransferTargetAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultTransferTargetAccount(account);
  };

  return accounts === null ? (
    <Loader loaderColor="blue" />
  ) : (
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
          Default transfer target account
        </Heading>
      </div>
      <ModalCustom
        modalOpenButtonLabel="Set default transfer target account"
        onConfirm={handleSave}
        submitButtonLabel="Save"
      >
        <Select
          id="toAccount"
          options={accounts.map(({ name, _id }) => ({
            label: name,
            value: _id,
          }))}
          defaultValue={defaultTransferTargetAccount}
          isRequired
          handleOnChange={handleSelectChange}
        >
          Default transfer target account
        </Select>
      </ModalCustom>
    </>
  );
};
