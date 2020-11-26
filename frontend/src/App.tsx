import React, { useEffect, useState } from "react";
import Financer from "./Financer";

const App = (): JSX.Element => {
  const [profileInfo, setProfileInfo] = useState<IUser | IAuthenticationFailed>(
    { authenticated: false, message: "" }
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await fetch("/api/profile");
      setProfileInfo(await userInfo.json());
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
