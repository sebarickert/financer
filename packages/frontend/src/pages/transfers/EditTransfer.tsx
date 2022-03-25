import { ITransaction, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { useEditTransfer } from '../../hooks/transfer/useEditTransfer';
import { useTransferById } from '../../hooks/transfer/useTransferById';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { TransferForm } from './TransferForm';

export const EditTransfer = (): JSX.Element => {
  const navigate = useNavigate();
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
    if (!id) {
      console.error('Failed to edit transfer: no id');
      return;
    }
    try {
      const newTransactionJson = await editTransaction(
        {
          ...targetTransferData,
          categories: transactionCategoryMappings,
        } as any,
        id
      );

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
