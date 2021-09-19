import React from "react";
import { Switch, Route } from "react-router-dom";
import Statistics from "./Statistics";

const StatisticsRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/statistics">
        <Statistics />
      </Route>
    </Switch>
  );
};

export default StatisticsRouter;
