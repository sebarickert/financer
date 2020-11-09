import React, { useEffect, useState } from "react";

const LoginBlock = () => (
  <ul>
    <li>
      <a href="/api/auth/github">Login with github</a>
    </li>
  </ul>
);

const Logout = () => <a href="/api/auth/logout">Logout</a>;

const App = () => {
  const [profileInfo, setProfileInfo] = useState<any>(undefined);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await fetch("/api/profile");
      setProfileInfo(await userInfo.json());
    };
    fetchUserInfo();
  }, []);
  return (
    <div>
      {profileInfo?.authenticated ? <Logout /> : <LoginBlock />}

      <pre>{JSON.stringify(profileInfo)}</pre>
    </div>
  );
};

export default App;
