import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddAccount } from '../../hooks/account/useAddAccount';

import { AccountForm } from './AccountForm';

export const AddAccount = (): JSX.Element => {
  const navigate = useNavigate();
  const addAccount = useAddAccount();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: IAccount) => {
    try {
      const newAccount = await addAccount(newAccountData);

      if (newAccount.status === 201) {
        navigate('/accounts');
      } else if (newAccount.status === 400) {
        setErrors(newAccount?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add account" />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add account"
        submitLabel="Submit"
      />
    </>
  );
};
