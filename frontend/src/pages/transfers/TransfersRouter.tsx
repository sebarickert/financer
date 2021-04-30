import React from "react";
import { Switch, Route } from "react-router-dom";
import Transfer from "./Transfer";

const TransfersRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/transfers/:id">
        <Transfer />
      </Route>
    </Switch>
  );
};

export default TransfersRouter;
