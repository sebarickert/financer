import React from 'react';

import { DesktopNavigationItem } from './desktop-navigation.item';

export const DesktopNavigation = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1">
      <nav aria-label="Main navigation in desktop viewmode.">
        <ul className="-mr-4">
          <DesktopNavigationItem
            label="Home"
            iconName="home"
            link="/"
            isExact
          />
          <DesktopNavigationItem
            label="Statistics"
            iconName="chart-bar"
            link="/statistics"
            isActive={(match: never, location: { pathname: string }) =>
              location.pathname.substr(0, 11) === '/statistics' &&
              location.pathname.substr(-4) !== '/add'
            }
          />
          <DesktopNavigationItem
            label="Accounts"
            iconName="view-grid"
            link="/accounts"
          />
          <DesktopNavigationItem
            label="Profile"
            iconName="user-circle"
            link="/profile"
          />
        </ul>
      </nav>
      <nav
        className="border-t pt-8 mt-8"
        aria-label="Quick transaction actions navigation in desktop viewmode."
      >
        <ul className="-mr-4">
          <DesktopNavigationItem
            label="Income"
            iconName="download"
            link="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
          />
          <DesktopNavigationItem
            label="Expense"
            iconName="upload"
            link="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
          />
          <DesktopNavigationItem
            label="Transfer"
            iconName="switch-horizontal"
            link="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
          />
        </ul>
      </nav>
      <nav
        className="border-t pt-8 mt-8"
        aria-label="User action links navigation in desktop viewmode."
      >
        <ul className="-mr-4">
          <DesktopNavigationItem
            label="Sign out"
            iconName="logout"
            link="/auth/logout"
          />
        </ul>
      </nav>
    </div>
  );
};
