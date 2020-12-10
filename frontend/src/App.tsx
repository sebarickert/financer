import React, { useEffect, useState } from "react";
import Financer from "./Financer";
import { getProfileInformation } from "./pages/profile/ProfileService";

const App = (): JSX.Element => {
  const [profileInfo, setProfileInfo] = useState<IUser | IAuthenticationFailed>(
    { authenticated: false, message: "" }
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      setProfileInfo(await getProfileInformation());
    };
    fetchUserInfo();
  }, []);

  return (
    <>
      <Financer
        isLoggedIn={
          !("authenticated" in profileInfo && !profileInfo?.authenticated)
        }
      />
    </>
  );
};

export default App;
