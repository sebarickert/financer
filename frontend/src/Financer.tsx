import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Layout } from './components/layout/layout';
import { IssuesWithLogin } from './IssuesWithLogin';
import { AccountsRouter } from './pages/accounts/AccountsRouter';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ExpensesRouter } from './pages/expenses/ExpensesRouter';
import { IncomesRouter } from './pages/income/IncomesRouter';
import { Login } from './pages/login/login';
import { ProfileRouter } from './pages/profile/ProfileRouter';
import { StatisticsRouter } from './pages/statistics/StatisticsRouter';
import { TransfersRouter } from './pages/transfers/TransfersRouter';
import { PrivacyPolicy } from './Privacy';

interface IFinancerProps {
  isLoggedIn: boolean;
}

export const Financer = ({
  isLoggedIn = false,
}: IFinancerProps): JSX.Element => {
  return (
    <Switch>
      <Route path="/privacy-policy">
        <PrivacyPolicy />
      </Route>
      <Route path="/issues-with-login">
        <IssuesWithLogin />
      </Route>
      {!isLoggedIn && (
        <Route path="/">
          <Login />
        </Route>
      )}
      <Layout>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route path="/statistics/incomes">
          <IncomesRouter />
        </Route>
        <Route path="/statistics/expenses">
          <ExpensesRouter />
        </Route>
        <Route path="/statistics/transfers">
          <TransfersRouter />
        </Route>
        <Route path="/statistics">
          <StatisticsRouter />
        </Route>
        <Route path="/accounts">
          <AccountsRouter />
        </Route>
        <Route path="/profile">
          <ProfileRouter />
        </Route>
      </Layout>
    </Switch>
  );
};
