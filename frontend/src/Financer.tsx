import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import AccountsRouter from "./pages/accounts/AccountsRouter";
import ExpensesRouter from "./pages/expenses/ExpensesRouter";
import IncomesRouter from "./pages/income/IncomesRouter";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivacyPolicy from "./Privacy";
import Login from "./pages/login/login";
import IssuesWithLogin from "./IssuesWithLogin";

interface IProps {
  isLoggedIn: boolean;
}

const Financer = ({ isLoggedIn = false }: IProps): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/issues-with-login">
          <IssuesWithLogin />
        </Route>
        {!isLoggedIn && (
          <Route path="/">
            <Login />
          </Route>
        )}
        <Layout>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/incomes">
            <IncomesRouter />
          </Route>
          <Route path="/expenses">
            <ExpensesRouter />
          </Route>
          <Route path="/accounts">
            <AccountsRouter />
          </Route>
        </Layout>
      </Switch>
    </Router>
  );
};

export default Financer;
