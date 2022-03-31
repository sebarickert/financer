import { IAccount } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAddAccount } from '../../hooks/account/useAddAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { AccountForm } from './AccountForm';

export const AddAccount = (): JSX.Element => {
  const navigate = useNavigate();
  const addAccount = useAddAccount();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: IAccount) => {
    try {
      const newAccount = await addAccount(newAccountData);

      if ('message' in newAccount) {
        setErrors(parseErrorMessagesToArray(newAccount.message));
        return;
      }

      navigate('/accounts');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title="Add account" />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add account"
        submitLabel="Submit"
      />
    </>
  );
};
