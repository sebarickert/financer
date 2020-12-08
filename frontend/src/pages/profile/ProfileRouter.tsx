import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";

const ProfileRouter = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/profile">
        <Profile />
      </Route>
    </Switch>
  );
};

export default ProfileRouter;
