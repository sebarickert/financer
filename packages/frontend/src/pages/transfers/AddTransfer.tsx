import { ITransaction, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useUserDefaultTransferSourceAccount } from '../../hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '../../hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useAddTransfer } from '../../hooks/transfer/useAddTransfer';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { TransferForm } from './TransferForm';

export const AddTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const addTransaction = useAddTransfer();
  const [defaultTransferSourceAccount] = useUserDefaultTransferSourceAccount();
  const [defaultTransferTargetAccount] = useUserDefaultTransferTargetAccount();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (
    newTransfer: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ) => {
    try {
      const newTransactionJson = await addTransaction(newTransfer);

      if ('message' in newTransactionJson) {
        setErrors(parseErrorMessagesToArray(newTransactionJson.message));
        return;
      }

      if (transactionCategoryMappings.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newTransactionCategoryMappingJson =
          await addTransactionCategoryMapping(
            transactionCategoryMappings.map(
              (newTransactionCategoryMappingData) => ({
                ...newTransactionCategoryMappingData,
                transaction_id: newTransactionJson.payload._id,
              })
            )
          );
      }

      navigate('/statistics/transfers');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add transfer" />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add transfer"
        submitLabel="Submit"
        fromAccount={defaultTransferSourceAccount}
        toAccount={defaultTransferTargetAccount}
      />
    </>
  );
};
