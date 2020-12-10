import React from "react";
import { Switch, Route } from "react-router-dom";
import Container from "../../components/container/container";
import Profile from "./Profile";
import ProfileNavigation from "./ProfileNavigation";

const ProfileRouter = (): JSX.Element => {
  return (
    <Container
      className="mt-6 sm:mt-12"
      sidebarComponent={<ProfileNavigation />}
    >
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Container>
  );
};

export default ProfileRouter;
