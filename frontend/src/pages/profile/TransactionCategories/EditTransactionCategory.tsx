/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Container from "../../../components/container/container";
import Loader from "../../../components/loader/loader";
import SEO from "../../../components/seo/seo";
import {
  editTransactionCategory,
  getTransactionCategoryById,
} from "./TransactionCategoriesService";
import TransactionCategoryForm from "./TransactionCategoryForm";

const EditTransactionCategory = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [transactionCategory, setTransactionCategory] = useState<
    ITransactionCategory | undefined
  >(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTransactionCategory = async () => {
      setTransactionCategory(await getTransactionCategoryById(id));
    };
    fetchTransactionCategory();
  }, [id]);

  const handleSubmit = async (
    newTransactionCategoryData: ITransactionCategory
  ) => {
    /* eslint-disable no-param-reassign */
    newTransactionCategoryData.owner = transactionCategory?.owner;
    newTransactionCategoryData._id = transactionCategory?._id;
    /* eslint-enable no-param-reassign */
    try {
      const newTransactionCategory = await editTransactionCategory(
        newTransactionCategoryData._id,
        newTransactionCategoryData
      );

      if (newTransactionCategory.status === 200) {
        history.push(`/profile/transaction-categories`);
      } else if (newTransactionCategory.status === 400) {
        setErrors(newTransactionCategory?.errors || ["Unknown error."]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return typeof transactionCategory === "undefined" ? (
    <Loader loaderColor="green" />
  ) : (
    <Container>
      <SEO title="Add expense | Expenses" />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit transaction category"
        submitLabel="Update"
        name={transactionCategory.name}
        visibility={transactionCategory.visibility}
        parentTransactioCategoryId={transactionCategory.parent_category_id}
      />
    </Container>
  );
};

export default EditTransactionCategory;
