import React from "react";
import { Switch, Route } from "react-router-dom";
import AddTransactionCategory from "./AddTransactionCategory";
import TransactionCategories from "./TransactionCategories";

const TransactionCategoriesRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/profile/transaction-categories">
        <TransactionCategories />
      </Route>
      <Route exact path="/profile/transaction-categories/add">
        <AddTransactionCategory />
      </Route>
    </Switch>
  );
};

export default TransactionCategoriesRouter;
