import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountForm } from './AccountForm';

import {
  CreateAccountDto,
  useAccountsCreateMutation,
} from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddAccount = (): JSX.Element => {
  const navigate = useNavigate();
  const [addAccount, { isLoading }] = useAccountsCreateMutation();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: CreateAccountDto) => {
    try {
      await addAccount({
        createAccountDto: newAccountData,
      }).unwrap();

      navigate('/accounts');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.status !== 400) console.error(error);

      if ('message' in error?.data) {
        setErrors(parseErrorMessagesToArray(error.data.message));
        return;
      }
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
