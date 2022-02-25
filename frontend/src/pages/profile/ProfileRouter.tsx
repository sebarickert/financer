import { Switch, Route } from 'react-router-dom';

import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

import { Profile } from './Profile';
import { ProfileOverrideData } from './ProfileOverrideData';
import { TransactionCategoriesRouter } from './TransactionCategories/TransactionCategoriesRouter';

export const ProfileRouter = (): JSX.Element => {
  const profileInfo = useProfileInformation();

  return (
    <Switch>
      <Route exact path="/profile">
        <Profile />
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
