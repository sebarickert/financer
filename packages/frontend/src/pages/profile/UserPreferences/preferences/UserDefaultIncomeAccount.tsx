import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Loader } from '../../../../components/loader/loader';
import { MobileHeader } from '../../../../components/mobile-header/mobile-header';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultIncomeAccount } from '../../../../hooks/profile/user-preference/useUserDefaultIncomeAccount';

export const UserDefaultIncomeAccount = (): JSX.Element => {
  const accounts = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultIncomeAccount, setDefaultIncomeAccount] =
    useUserDefaultIncomeAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultIncomeAccount(account);
  };

  return accounts === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <MobileHeader backLink={'/profile/user-preferences'}>
        Default income account
      </MobileHeader>
      <ModalCustom
        modalOpenButtonLabel="Set default income account"
        onConfirm={handleSave}
        submitButtonLabel="Save"
      >
        <Select
          id="toAccount"
          options={accounts.map(({ name, _id }) => ({
            label: name,
            value: _id,
          }))}
          defaultValue={defaultIncomeAccount}
          isRequired
          handleOnChange={handleSelectChange}
        >
          Default income account
        </Select>
      </ModalCustom>
    </>
  );
};
