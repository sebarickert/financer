import clsx from 'clsx';

import { NavigationItem } from './navigation';
import { NavigationDesktopItem } from './navigation.desktop.item';

import { IconName } from '$elements/icon/icon';

interface NavigationDesktopProps {
  navigationItems: Record<string, NavigationItem>;
  className?: string;
}

export const NavigationDesktop = ({
  navigationItems,
  className,
}: NavigationDesktopProps) => {
  return (
    <div className={clsx(className, 'grid grid-cols-1')}>
      <nav aria-label="Main navigation in desktop view mode.">
        <ul className="-ml-4 space-y-2">
          <NavigationDesktopItem {...navigationItems.home} />
          <NavigationDesktopItem {...navigationItems.statistics} />
          <NavigationDesktopItem {...navigationItems.accounts} />
          <NavigationDesktopItem {...navigationItems.settings} />
        </ul>
      </nav>
      <nav
        className="pt-8 mt-8 border-t border-gray-dark"
        aria-label="Quick transaction actions navigation in desktop view mode."
      >
        <ul className="-ml-4 space-y-2">
          <NavigationDesktopItem
            label="Income"
            iconName={IconName.download}
            url="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
          />
          <NavigationDesktopItem
            label="Expense"
            iconName={IconName.upload}
            url="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
          />
          <NavigationDesktopItem
            label="Transfer"
            iconName={IconName.switchHorizontal}
            url="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
          />
        </ul>
      </nav>
      <nav
        className="pt-8 mt-8 border-t border-gray-dark"
        aria-label="User action links navigation in desktop view mode."
      >
        <ul className="-ml-4">
          <NavigationDesktopItem
            label="Sign out"
            iconName={IconName.logout}
            url="/auth/logout"
          />
        </ul>
      </nav>
    </div>
  );
};
