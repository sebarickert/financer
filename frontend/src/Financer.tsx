import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import AccountsRouter from "./pages/accounts/AccountsRouter";
import ExpensesRouter from "./pages/expenses/ExpensesRouter";
import IncomesRouter from "./pages/income/IncomesRouter";

const Financer = (): JSX.Element => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/incomes">
            <IncomesRouter />
          </Route>
          <Route path="/expenses">
            <ExpensesRouter />
          </Route>
          <Route path="/accounts">
            <AccountsRouter />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default Financer;
