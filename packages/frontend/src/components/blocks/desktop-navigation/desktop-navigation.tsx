import { IconName } from '../../elements/icon/icon';

import { DesktopNavigationItem } from './desktop-navigation.item';

export const DesktopNavigation = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1">
      <nav aria-label="Main navigation in desktop viewmode.">
        <ul className="-ml-4 space-y-2">
          <DesktopNavigationItem
            label="Home"
            iconName={IconName.home}
            link="/"
            isExact
          />
          <DesktopNavigationItem
            label="Statistics"
            iconName={IconName.chartBar}
            link="/statistics"
            disallowedPathEndings={['add']}
          />
          <DesktopNavigationItem
            label="Accounts"
            iconName={IconName.viewGrid}
            link="/accounts"
          />
          <DesktopNavigationItem
            label="Profile"
            iconName={IconName.userCircle}
            link="/profile"
          />
        </ul>
      </nav>
      <nav
        className="pt-8 mt-8 border-t border-gray-dark"
        aria-label="Quick transaction actions navigation in desktop viewmode."
      >
        <ul className="-ml-4 space-y-2">
          <DesktopNavigationItem
            label="Income"
            iconName={IconName.download}
            link="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
          />
          <DesktopNavigationItem
            label="Expense"
            iconName={IconName.upload}
            link="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
          />
          <DesktopNavigationItem
            label="Transfer"
            iconName={IconName.switchHorizontal}
            link="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
          />
        </ul>
      </nav>
      <nav
        className="pt-8 mt-8 border-t border-gray-dark"
        aria-label="User action links navigation in desktop viewmode."
      >
        <ul className="-ml-4">
          <DesktopNavigationItem
            label="Sign out"
            iconName={IconName.logout}
            link="/auth/logout"
          />
        </ul>
      </nav>
    </div>
  );
};
