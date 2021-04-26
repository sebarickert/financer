import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Container from "../../components/container/container";
import Profile from "./Profile";
import ProfileNavigation from "./ProfileNavigation";
import ProfileOverrideData from "./ProfileOverrideData";
import { getProfileInformation } from "./ProfileService";

const ProfileRouter = (): JSX.Element => {
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setProfileInfo(await getProfileInformation());
    };
    fetchUserInfo();
  }, []);

  return (
    <Container
      className="pt-6 sm:pt-12"
      sidebarComponent={<ProfileNavigation userRoles={profileInfo?.roles} />}
    >
      <Switch>
        <Route exact path="/profile">
          <Profile profileInfo={profileInfo} />
        </Route>
        {profileInfo?.roles.includes("test-user") && (
          <Route exact path="/profile/override-data">
            <ProfileOverrideData />
          </Route>
        )}
      </Switch>
    </Container>
  );
};

export default ProfileRouter;
