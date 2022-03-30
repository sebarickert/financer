import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Loader } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultExpenseAccount } from '../../../../hooks/profile/user-preference/useUserDefaultExpenseAccount';

export const UserDefaultExpenseAccount = (): JSX.Element => {
  const accounts = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultExpenseAccount, setDefaultExpenseAccount] =
    useUserDefaultExpenseAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultExpenseAccount(account);
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
          Default expense account
        </Heading>
      </div>
      <ModalCustom
        modalOpenButtonLabel="Set default expense account"
        onConfirm={handleSave}
        submitButtonLabel="Save"
      >
        <Select
          id="fromAccount"
          options={accounts.map(({ name, _id }) => ({
            label: name,
            value: _id,
          }))}
          defaultValue={defaultExpenseAccount}
          isRequired
          handleOnChange={handleSelectChange}
        >
          Default expense account
        </Select>
      </ModalCustom>
    </>
  );
};
