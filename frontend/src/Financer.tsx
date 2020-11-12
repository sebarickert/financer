import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import AccountsRouter from "./pages/accounts/AccountsRouter";

const Financer = (): JSX.Element => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/accounts">
            <AccountsRouter />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default Financer;
