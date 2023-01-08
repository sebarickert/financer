import { CreateAccountDto } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountForm } from './AccountForm';

import { useAccountsCreateMutation } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddAccount = (): JSX.Element => {
  const navigate = useNavigate();
  const [addAccount, { isLoading }] = useAccountsCreateMutation();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: CreateAccountDto) => {
    try {
      const newAccount = await addAccount({
        createAccountDto: newAccountData,
      }).unwrap();

      if ('message' in newAccount) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setErrors(parseErrorMessagesToArray(newAccount.message));
        return;
      }

      navigate('/accounts');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo title="Add account" backLink="/accounts" />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Submit"
      />
    </>
  );
};
