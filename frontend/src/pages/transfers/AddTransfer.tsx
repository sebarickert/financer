import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddTransaction } from '../../hooks/transaction/useAddTransaction';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';

import { TransferForm } from './TransferForm';

export const AddTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const addTransaction = useAddTransaction();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (
    newTransfer: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ) => {
    try {
      const newTransactionJson = await addTransaction(newTransfer);
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

      if (newTransactionJson.status === 201) {
        history.push('/statistics/transfers');
      } else if (newTransactionJson.status === 400) {
        setErrors(newTransactionJson?.errors || ['Unknown error.']);
      }
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
      />
    </>
  );
};
