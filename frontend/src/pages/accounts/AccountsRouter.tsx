import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Account } from './Account';
import { Accounts } from './Accounts';
import { AddAccount } from './AddAccount';
import { EditAccount } from './EditAccount';

export const AccountsRouter = (): JSX.Element => {
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
      <Route exact path="/accounts/:id/edit">
        <EditAccount />
      </Route>
    </Switch>
  );
};
