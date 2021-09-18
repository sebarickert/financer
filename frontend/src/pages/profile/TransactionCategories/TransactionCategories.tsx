import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import Hero from "../../../components/hero/hero";
import HeroLead from "../../../components/hero/hero.lead";
import SEO from "../../../components/seo/seo";
import { getAllTransactionCategories } from "./TransactionCategoriesService";
import StackedList from "../../../components/stacked-list/stacked-list";
import { IStackedListRowProps } from "../../../components/stacked-list/stacked-list.row";
import Loader from "../../../components/loader/loader";

const parseParentCategoryPath = (
  allCategories: ITransactionCategory[],
  categoryId: string
): string => {
  const targetCategory = allCategories.find(({ _id }) => _id === categoryId);

  if (!targetCategory?.parent_category_id) {
    return `${targetCategory?.name}`;
  }
  const parentPath = parseParentCategoryPath(
    allCategories,
    targetCategory.parent_category_id
  );
  return `${parentPath} > ${targetCategory?.name}`;
};

const TransactionCategories = (): JSX.Element => {
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategory[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IStackedListRowProps[]
  >([]);

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(await getAllTransactionCategories());
    };

    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ _id, name, visibility }) => ({
        label: name,
        actions: [
          {
            label: "Edit",
            color: "blue",
            link: `/profile/transaction-categories/${_id}/edit`,
          },
        ],
        additionalInformation: [
          parseParentCategoryPath(transactionCategoriesRaw, _id),
          visibility.join(", "),
        ],
        id: _id,
      }))
    );
  }, [transactionCategoriesRaw]);

  return transactionCategoriesRaw === null ? (
    <Loader loaderColor="green" />
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
