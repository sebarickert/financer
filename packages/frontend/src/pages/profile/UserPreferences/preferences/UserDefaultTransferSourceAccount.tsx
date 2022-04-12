import { useState } from 'react';

import { Loader } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultTransferSourceAccount } from '../../../../hooks/profile/user-preference/useUserDefaultTransferSourceAccount';

export const UserDefaultTransferSourceAccount = (): JSX.Element => {
  const { data: accounts, isLoading: isLoadingAccounts } = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultTransferSourceAccount, setDefaultTransferSourceAccount] =
    useUserDefaultTransferSourceAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultTransferSourceAccount(account);
  };

  return isLoadingAccounts || !accounts ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo
        title="Default transfer source account"
        backLink={'/profile/user-preferences'}
      />
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
