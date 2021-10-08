import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { AddTransactionCategory } from './AddTransactionCategory';
import { EditTransactionCategory } from './EditTransactionCategory';
import { TransactionCategories } from './TransactionCategories';

export const TransactionCategoriesRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/profile/transaction-categories">
        <TransactionCategories />
      </Route>
      <Route exact path="/profile/transaction-categories/add">
        <AddTransactionCategory />
      </Route>
      <Route exact path="/profile/transaction-categories/:id/edit">
        <EditTransactionCategory />
      </Route>
    </Switch>
  );
};
