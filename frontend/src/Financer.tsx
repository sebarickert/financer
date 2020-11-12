import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Accounts from "./pages/Accounts";

const Financer = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/accounts">
          <Accounts />
        </Route>
      </Switch>
    </Router>
  );
};

export default Financer;
