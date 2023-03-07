import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountForm, AccountFormFields } from './AccountForm';

import {
  useAccountsFindOneByIdQuery,
  useAccountsUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditAccount = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error('Account id is not defined');

  const navigate = useNavigate();
  const [editAccount, { isLoading }] = useAccountsUpdateMutation();

  const [errors, setErrors] = useState<string[]>([]);

  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  const handleSubmit = useCallback(
    async (newAccountData: AccountFormFields) => {
      if (!account?._id) {
        setErrors(['Account not found']);
        return;
      }

      try {
        const newAccount = await editAccount({
          id: account._id,
          updateAccountDto: newAccountData,
        });

        if ('message' in newAccount) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setErrors(parseErrorMessagesToArray(newAccount.message));
          return;
        }

        navigate(`/accounts/${id}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [account?._id, editAccount, id, navigate]
  );

  return (
    <>
      {isLoading && <LoaderFullScreen />}
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
            initialValues={account}
          />
        </>
      )}
    </>
  );
};
