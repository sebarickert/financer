import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { updateTransaction } from '../../services/TransactionService';
import { addTransactionCategoryMapping } from '../expenses/AddExpense';
import { getTransactionCategoryMappingByTransactionId } from '../expenses/Expense';

import { TransferForm } from './TransferForm';
import { getTransferById } from './TransferService';

export const EditTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [transfer, setTransfer] = useState<ITransaction | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTransfer = async () => {
      setTransfer(await getTransferById(id));
    };

    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchTransfer();
    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async (
    targetTransferData: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ) => {
    try {
      const newTransactionJson = await updateTransaction(
        targetTransferData,
        id
      );
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

  return typeof transfer === 'undefined' ||
    typeof transactionCategoryMapping === 'undefined' ? (
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
