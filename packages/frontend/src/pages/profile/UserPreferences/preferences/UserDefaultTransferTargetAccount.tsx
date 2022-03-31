import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Loader } from '../../../../components/loader/loader';
import { MobileHeader } from '../../../../components/mobile-header/mobile-header';
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
      <MobileHeader backLink={'/profile/user-preferences'}>
        Default transfer target account
      </MobileHeader>
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
