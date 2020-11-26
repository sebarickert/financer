import React, { useEffect, useState } from "react";
import Financer from "./Financer";
import Login from "./components/login/login";

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
    <div>
      {"authenticated" in profileInfo &&
      profileInfo?.authenticated === false ? (
        <Login />
      ) : (
        <Financer />
      )}
    </div>
  );
};

export default App;
