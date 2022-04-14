import { CreateAccountDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader, LoaderColor } from '../../components/loader/loader';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useEditAccount } from '../../hooks/account/useEditAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { AccountForm } from './AccountForm';

export const EditAccount = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editAccount = useEditAccount();

  const [errors, setErrors] = useState<string[]>([]);

  const [{ data: account, isLoading }] = useAccountById(id);

  const handleSubmit = async (newAccountData: CreateAccountDto) => {
    if (!account?._id) {
      setErrors(['Account not found']);
      return;
    }
    try {
      const newAccount = await editAccount(account._id, newAccountData);

      if ('message' in newAccount) {
        setErrors(parseErrorMessagesToArray(newAccount.message));
        return;
      }

      navigate(`/accounts/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return isLoading || !account ? (
    <Loader loaderColor={LoaderColor.blue} />
  ) : (
    <>
      <UpdatePageInfo
        title={`Edit ${account.name}`}
        backLink={`/accounts/${account._id}`}
      />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        name={account.name}
        balance={account.balance}
        type={account.type}
      />
    </>
  );
};
