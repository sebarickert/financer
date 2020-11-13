import React from "react";
import { Switch, Route } from "react-router-dom";
import AddAccount from "./AddAccount";
import Accounts from "./Accounts";
import Account from "./Account";

const AccountsRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/accounts">
        <Accounts />
      </Route>
      <Route exact path="/accounts/add">
        <AddAccount />
      </Route>
      <Route exact path="/accounts/:id">
        <Account />
      </Route>
    </Switch>
  );
};

export default AccountsRouter;
