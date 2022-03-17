import { Routes, Route } from 'react-router-dom';

import { Layout } from './components/layout/layout';
import { IssuesWithLogin } from './IssuesWithLogin';
import { AccountsRouter } from './pages/accounts/AccountsRouter';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/login/login';
import { ProfileRouter } from './pages/profile/ProfileRouter';
import { StatisticsRouter } from './pages/statistics/StatisticsRouter';
import { PrivacyPolicy } from './Privacy';

interface IFinancerProps {
  isLoggedIn: boolean;
}

export const Financer = ({
  isLoggedIn = false,
}: IFinancerProps): JSX.Element => {
  console.log(isLoggedIn);
  return (
    <Routes>
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="issues-with-login" element={<IssuesWithLogin />} />
      {!isLoggedIn ? (
        <Route path="*" element={<Login />} />
      ) : (
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="statistics/*" element={<StatisticsRouter />} />
          <Route path="accounts/*" element={<AccountsRouter />} />
          <Route path="profile/*" element={<ProfileRouter />} />
        </Route>
      )}
    </Routes>
  );
};
