import { useState } from 'react';

import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
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

  return (
    <>
      <UpdatePageInfo
        title="Default transfer target account"
        backLink={'/profile/user-preferences'}
      />
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
