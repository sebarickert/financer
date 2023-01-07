import { CreateAccountDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountForm } from './AccountForm';

import { useAccountsFindOneByIdQuery } from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useEditAccount } from '$hooks/account/useEditAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditAccount = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error('Account id is not defined');

  const navigate = useNavigate();
  const editAccount = useEditAccount();

  const [errors, setErrors] = useState<string[]>([]);

  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

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
      console.error(error);
    }
  };

  return (
    <>
      <DataHandler {...data} />
      {!!account && (
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
      )}
    </>
  );
};
