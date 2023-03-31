import { useRouter } from 'next/router';
import { useState } from 'react';

import { TransferForm } from './TransferForm';

import {
  CreateTransferDto,
  TransactionTypeEnum,
  useTransfersCreateMutation,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useUserDefaultTransferSourceAccount } from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransfer = (): JSX.Element => {
  const { push } = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransaction, { isLoading: isCreating }] =
    useTransfersCreateMutation();
  const {
    data: defaultTransferSourceAccount,
    isLoading: isLoadingDefaultTransferSourceAccount,
  } = useUserDefaultTransferSourceAccount();
  const {
    data: defaultTransferTargetAccount,
    isLoading: isLoadingDefaultTransferTargetAccount,
  } = useUserDefaultTransferTargetAccount();

  const handleSubmit = async (newTransferData: CreateTransferDto) => {
    try {
      await addTransaction({
        createTransferDto: newTransferData,
      }).unwrap();

      push('/statistics/transfers');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading =
    isLoadingDefaultTransferSourceAccount ||
    isLoadingDefaultTransferTargetAccount;

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add transfer"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionTypeEnum.Transfer}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <TransferForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Submit"
          initialValues={{
            fromAccount: defaultTransferSourceAccount,
            toAccount: defaultTransferTargetAccount,
          }}
        />
      )}
    </>
  );
};
