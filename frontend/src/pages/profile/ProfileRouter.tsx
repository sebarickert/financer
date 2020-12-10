import React from "react";
import { Switch, Route } from "react-router-dom";
import Container from "../../components/container/container";
import Profile from "./Profile";
import ProfileNavigation from "./ProfileNavigation";
import ProfileOverrideData from "./ProfileOverrideData";

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
        <Route exact path="/profile/override-data">
          <ProfileOverrideData />
        </Route>
      </Switch>
    </Container>
  );
};

export default ProfileRouter;
