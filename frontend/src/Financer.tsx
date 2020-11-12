import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Accounts from "./pages/Accounts";

const Financer = (): JSX.Element => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/accounts">
            <Accounts />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default Financer;
