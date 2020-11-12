import React from "react";
import { Switch, Route } from "react-router-dom";
import AddAccount from "./AddAccount";
import Accounts from "./Accounts";

const AccountsRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/accounts">
        <Accounts />
      </Route>
      <Route exact path="/accounts/add">
        <AddAccount />
      </Route>
    </Switch>
  );
};

export default AccountsRouter;
