import { useState } from 'react';

import { Heading } from '../../../../components/heading/heading';
import { Loader } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
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
      <UpdatePageInfo
        title="Default expense account"
        backLink={'/profile/user-preferences'}
      />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        Default expense account
      </Heading>
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
