import React from "react";
import DesktopNavigationItem from "./desktop-navigation.item";

const DesktopNavigation = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1">
      <nav aria-label="Main navigation in desktop viewmode.">
        <ul className="-mr-4">
          <DesktopNavigationItem label="Home" iconName="home" link="/" />
          <DesktopNavigationItem
            label="Stats"
            iconName="chart-bar"
            link="/expenses"
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
            link="/incomes/add"
            ariaLabel="Add new income transaction"
          />
          <DesktopNavigationItem
            label="Expense"
            iconName="upload"
            link="/expenses/add"
            ariaLabel="Add new expense transaction"
          />
          <DesktopNavigationItem
            label="Transfer"
            iconName="switch-horizontal"
            link="/accounts/transfer"
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

export default DesktopNavigation;
