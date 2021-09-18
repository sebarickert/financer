/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Container from "../../components/container/container";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import { getTransactionCategoryMappingByTransactionId } from "./Expense";
import ExpenseForm from "./ExpenseForm";
import { getExpenseById } from "./ExpenseService";

const EditExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      setExpense(await getExpenseById(id));
    };

    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchExpense();
    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async () => {};

  return typeof expense === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <Container className="mt-6 sm:mt-12">
      <SEO title={`Edit ${expense.description} | Expenses`} />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit expense"
        submitLabel="Update"
        amount={expense.amount}
        description={expense.description}
        date={new Date(expense.date)}
        fromAccount={expense.fromAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </Container>
  );
};

export default EditExpense;
