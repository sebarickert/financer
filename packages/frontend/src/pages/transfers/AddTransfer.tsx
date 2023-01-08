import { TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import { CreateTransferDto } from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { useUserDefaultTransferSourceAccount } from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { useAddTransfer } from '$hooks/transfer/useAddTransfer';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransaction = useAddTransfer();
  const {
    data: defaultTransferSourceAccount,
    isLoading: isLoadingDefaultTransferSourceAccount,
  } = useUserDefaultTransferSourceAccount();
  const {
    data: defaultTransferTargetAccount,
    isLoading: isLoadingDefaultTransferTargetAccount,
  } = useUserDefaultTransferTargetAccount();

  const handleSubmit = async (newTransfer: CreateTransferDto) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newTransactionJson = await addTransaction(newTransfer as any);

      if ('message' in newTransactionJson) {
        setErrors(parseErrorMessagesToArray(newTransactionJson.message));
        return;
      }

      navigate('/statistics/transfers');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading =
    isLoadingDefaultTransferSourceAccount ||
    isLoadingDefaultTransferTargetAccount;

  return (
    <>
      <UpdatePageInfo
        title="Add transfer"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionType.TRANSFER}
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
          fromAccount={defaultTransferSourceAccount}
          toAccount={defaultTransferTargetAccount}
        />
      )}
    </>
  );
};
