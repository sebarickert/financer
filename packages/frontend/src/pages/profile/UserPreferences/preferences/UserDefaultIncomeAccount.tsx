import { useState } from 'react';

import { Loader, LoaderColor } from '../../../../components/loader/loader';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
import { useAllAccounts } from '../../../../hooks/account/useAllAccounts';
import { useUserDefaultIncomeAccount } from '../../../../hooks/profile/user-preference/useUserDefaultIncomeAccount';

export const UserDefaultIncomeAccount = (): JSX.Element => {
  const { data: accounts, isLoading: isLoadingAccounts } = useAllAccounts();
  const [account, setAccount] = useState('');
  const [defaultIncomeAccount, setDefaultIncomeAccount] =
    useUserDefaultIncomeAccount();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(event.target.value);
  };

  const handleSave = () => {
    setDefaultIncomeAccount(account);
  };

  return isLoadingAccounts || !accounts ? (
    <Loader loaderColor={LoaderColor.blue} />
  ) : (
    <>
      <UpdatePageInfo
        title="Default income account"
        backLink={'/profile/user-preferences'}
      />
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
