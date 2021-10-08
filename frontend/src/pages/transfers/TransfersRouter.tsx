import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { AddTransfer } from './AddTransfer';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';

export const TransfersRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/statistics/transfers">
        <Transfers />
      </Route>
      <Route exact path="/statistics/transfers/add">
        <AddTransfer />
      </Route>
      <Route exact path="/statistics/transfers/:id">
        <Transfer />
      </Route>
    </Switch>
  );
};
