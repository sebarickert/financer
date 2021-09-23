import React from "react";
import { Switch, Route } from "react-router-dom";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import Expense from "./Expense";
import Expenses from "./Expenses";

const ExpensesRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/statistics/expenses">
        <Expenses />
      </Route>
      <Route exact path="/statistics/expenses/add">
        <AddExpense />
      </Route>
      <Route exact path="/statistics/expenses/:id">
        <Expense />
      </Route>
      <Route exact path="/statistics/expenses/:id/edit">
        <EditExpense />
      </Route>
    </Switch>
  );
};

export default ExpensesRouter;
