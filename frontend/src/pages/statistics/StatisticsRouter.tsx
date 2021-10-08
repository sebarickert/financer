import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Statistics } from './Statistics';

export const StatisticsRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/statistics">
        <Statistics />
      </Route>
    </Switch>
  );
};
