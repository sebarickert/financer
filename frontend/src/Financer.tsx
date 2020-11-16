import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import AccountsRouter from "./pages/accounts/AccountsRouter";
import ExpensesRouter from "./pages/expenses/ExpensesRouter";

const Financer = (): JSX.Element => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/accounts">
            <AccountsRouter />
          </Route>
          <Route path="/expenses">
            <ExpensesRouter />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default Financer;
