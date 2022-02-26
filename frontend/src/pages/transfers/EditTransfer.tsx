import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { useEditTransfer } from '../../hooks/transfer/useEditTransfer';
import { useTransferById } from '../../hooks/transfer/useTransferById';

import { TransferForm } from './TransferForm';

export const EditTransfer = (): JSX.Element => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const [transfer] = useTransferById(id);
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const editTransaction = useEditTransfer();

  const handleSubmit = async (
    targetTransferData: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ) => {
    try {
      const newTransactionJson = await editTransaction(targetTransferData, id);
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

  return !transfer || !transactionCategoryMapping ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Edit transfer" />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit transfer"
        submitLabel="Update"
        amount={transfer.amount}
        date={new Date(transfer.date)}
        description={transfer.description}
        fromAccount={transfer.fromAccount}
        toAccount={transfer.toAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </>
  );
};
