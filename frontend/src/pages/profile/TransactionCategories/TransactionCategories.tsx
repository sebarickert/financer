import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import Hero from "../../../components/hero/hero";
import HeroLead from "../../../components/hero/hero.lead";
import SEO from "../../../components/seo/seo";
import StackedList from "../../../components/stacked-list/stacked-list";
import { IStackedListRowProps } from "../../../components/stacked-list/stacked-list.row";
import Loader from "../../../components/loader/loader";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "./TransactionCategoriesService";

const TransactionCategories = (): JSX.Element => {
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IStackedListRowProps[]
  >([]);

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };

    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(
        ({ _id, name, visibility, categoryTree }) => ({
          label: name,
          actions: [
            {
              label: "Edit",
              color: "blue",
              link: `/profile/transaction-categories/${_id}/edit`,
            },
          ],
          additionalInformation: [categoryTree, visibility.join(", ")],
          id: _id,
        })
      )
    );
  }, [transactionCategoriesRaw]);

  return transactionCategoriesRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Transaction categories | Profile" />
      <Hero label="Transaction categories" standAlone className="mb-12">
        <HeroLead className="!text-gray-600">
          Below you are able to add, delete or edit your transaction categories.
        </HeroLead>
      </Hero>
      <Button
        link="/profile/transaction-categories/add"
        accentColor="green"
        className="mb-5"
      >
        Add transaction category
      </Button>
      <StackedList rows={transactionCategories} />
    </>
  );
};

export default TransactionCategories;
