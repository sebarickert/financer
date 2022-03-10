import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useEditAccount } from '../../hooks/account/useEditAccount';

import { AccountForm } from './AccountForm';

export const EditAccount = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editAccount = useEditAccount();

  const [errors, setErrors] = useState<string[]>([]);

  const [account] = useAccountById(id);

  const handleSubmit = async (newAccountData: IAccount) => {
    /* eslint-disable no-param-reassign */
    newAccountData.owner = account?.owner;
    newAccountData._id = account?._id;
    /* eslint-enable no-param-reassign */
    try {
      const newAccount = await editAccount(newAccountData._id, newAccountData);

      if (newAccount.status === 200) {
        navigate(`/accounts/${id}`);
      } else if (newAccount.status === 400) {
        setErrors(newAccount?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return !account ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${account.name}`} />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit account"
        submitLabel="Update"
        name={account.name}
        balance={account.balance}
        type={account.type}
      />
    </>
  );
};
