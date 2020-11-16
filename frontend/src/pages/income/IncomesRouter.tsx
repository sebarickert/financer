import React from "react";
import { Switch, Route } from "react-router-dom";
import AddIncome from "./AddIncome";
import EditIncome from "./EditIncome";
import Income from "./Income";
import Incomes from "./Incomes";

const IncomesRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/incomes">
        <Incomes />
      </Route>
      <Route exact path="/incomes/add">
        <AddIncome />
      </Route>
      <Route exact path="/incomes/:id">
        <Income />
      </Route>
      <Route exact path="/incomes/:id/edit">
        <EditIncome />
      </Route>
    </Switch>
  );
};

export default IncomesRouter;
