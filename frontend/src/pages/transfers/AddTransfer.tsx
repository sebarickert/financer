import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SEO from "../../components/seo/seo";
import { addTransaction } from "../../services/TransactionService";
import { addTransactionCategoryMapping } from "../expenses/AddExpense";
import TransferForm from "./TransferForm";

const AddTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

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
        history.push("/statistics/transfers");
      } else if (newTransactionJson.status === 400) {
        setErrors(newTransactionJson?.errors || ["Unknown error."]);
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

export default AddTransfer;
