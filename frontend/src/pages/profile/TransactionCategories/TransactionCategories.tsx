import React, { useEffect, useState } from "react";
import Loader from "@silte/react-loader";
import Button from "../../../components/button/button";
import Hero from "../../../components/hero/hero";
import HeroLead from "../../../components/hero/hero.lead";
import SEO from "../../../components/seo/seo";
import { getAllTransactionCategories } from "./TransactionCategoriesService";

const TransactionCategories = (): JSX.Element => {
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };

    fetchTransactionCategories();
  }, []);

  return transactionCategories === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title="Transaction categories | Profile" />
      <Hero label="Transaction categories" standAlone className="mb-12">
        <HeroLead className="!text-gray-600">
          Below you are able to add, delete or edit your transaction categories.
        </HeroLead>
      </Hero>
      <Button link="/profile/transaction-categories/add" accentColor="green">
        Add transaction category
      </Button>
      {transactionCategories.map((category) => (
        <li>{category.name}</li>
      ))}
    </>
  );
};

export default TransactionCategories;
