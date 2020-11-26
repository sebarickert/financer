import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivacyPolicy from "../../components/login/privacy.policy";
import Login from "../../components/login/login";

const LoginRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoginRouter;
