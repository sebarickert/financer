import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Profile } from './Profile';
import { ProfileOverrideData } from './ProfileOverrideData';
import { getProfileInformation } from './ProfileService';
import { TransactionCategoriesRouter } from './TransactionCategories/TransactionCategoriesRouter';

export const ProfileRouter = (): JSX.Element => {
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setProfileInfo(await getProfileInformation());
    };
    fetchUserInfo();
  }, []);

  return (
    <Switch>
      <Route exact path="/profile">
        <Profile profileInfo={profileInfo} />
      </Route>
      <Route path="/profile/transaction-categories">
        <TransactionCategoriesRouter />
      </Route>
      {profileInfo?.roles.includes('test-user') && (
        <Route exact path="/profile/override-data">
          <ProfileOverrideData />
        </Route>
      )}
    </Switch>
  );
};
