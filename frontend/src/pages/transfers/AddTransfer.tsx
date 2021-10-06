import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import { getAllAccounts } from "../accounts/AccountService";
import { addTransaction } from "../../services/TransactionService";
import Container from "../../components/container/container";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import Button from "../../components/button/button";
import { addTransactionCategoryMapping } from "../expenses/AddExpense";
import TransferForm from "./TransferForm";

const AddTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IOption[] | null>(null);
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);

  const [categoryAmount, setCategoryAmount] = useState<number[]>([]);
  const addNewCategory = () =>
    setCategoryAmount([
      ...categoryAmount,
      Math.max(...(categoryAmount.length === 0 ? [-1] : categoryAmount)) + 1,
    ]);

  const deleteTransactionCategoryItem = (itemToDelete: number) =>
    setCategoryAmount(categoryAmount.filter((item) => item !== itemToDelete));

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };

    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };

    fetchAccounts();
    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (accountsRaw === null) return;

    setAccounts(
      accountsRaw.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
    );
  }, [accountsRaw]);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
        value: _id,
        label: categoryTree,
      }))
    );
  }, [transactionCategoriesRaw]);

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
