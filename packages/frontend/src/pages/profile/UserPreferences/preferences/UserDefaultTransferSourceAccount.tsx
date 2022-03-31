import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Loader } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultTransferSourceAccount } from '../../../../hooks/profile/user-preference/useUserDefaultTransferSourceAccount';

export const UserDefaultTransferSourceAccount = (): JSX.Element => {
  const accounts = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultTransferSourceAccount, setDefaultTransferSourceAccount] =
    useUserDefaultTransferSourceAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultTransferSourceAccount(account);
  };

  return accounts === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <div className="bg-blue-financer -mx-6 -mt-8 text-center py-4 mb-6 px-6 relative">
        <NavLink
          to={'/profile/user-preferences'}
          className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <span className="sr-only">Go back</span>
          <Icon type={'chevron-left'} className="stroke-white" />
        </NavLink>
        <Heading
          variant="h1"
          className="!text-base !tracking-tight !text-white !font-semibold"
        >
          Default transfer source account
        </Heading>
      </div>
      <ModalCustom
        modalOpenButtonLabel="Set default transfer source account"
        onConfirm={handleSave}
        submitButtonLabel="Save"
      >
        <Select
          id="fromAccount"
          options={accounts.map(({ name, _id }) => ({
            label: name,
            value: _id,
          }))}
          defaultValue={defaultTransferSourceAccount}
          isRequired
          handleOnChange={handleSelectChange}
        >
          Default transfer source account
        </Select>
      </ModalCustom>
    </>
  );
};
