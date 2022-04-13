import { ITransaction, TransactionCategoryMappingDto } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useUserDefaultTransferSourceAccount } from '../../hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '../../hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { useAddTransfer } from '../../hooks/transfer/useAddTransfer';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { TransferForm } from './TransferForm';

export const AddTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransaction = useAddTransfer();
  const [defaultTransferSourceAccount] = useUserDefaultTransferSourceAccount();
  const [defaultTransferTargetAccount] = useUserDefaultTransferTargetAccount();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (
    newTransfer: ITransaction,
    transactionCategoryMappings: TransactionCategoryMappingDto[]
  ) => {
    try {
      const newTransactionJson = await addTransaction({
        ...newTransfer,
        categories: transactionCategoryMappings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if ('message' in newTransactionJson) {
        setErrors(parseErrorMessagesToArray(newTransactionJson.message));
        return;
      }

      navigate('/statistics/transfers');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title="Add transfer" />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Submit"
        fromAccount={defaultTransferSourceAccount}
        toAccount={defaultTransferTargetAccount}
      />
    </>
  );
};
