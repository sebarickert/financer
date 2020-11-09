import React, { useEffect, useState } from "react";

const LoginBlock = () => (
  <ul>
    <li>
      <a href="/api/auth/github">Login with github</a>
    </li>
  </ul>
);

const Logout = () => <a href="/api/auth/logout">Logout</a>;

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
        <LoginBlock />
      ) : (
        <Logout />
      )}

      <pre>{JSON.stringify(profileInfo)}</pre>
    </div>
  );
};

export default App;
