import { NavigationDesktop } from './navigation.desktop';
import { NavigationMobile } from './navigation.mobile';

import { IconName } from '$elements/Icon';

export type NavigationItem = {
  label: string;
  url: string;
  iconName: IconName;
  ariaLabel?: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
};

interface NavigationProps {
  className?: string;
  variant: 'desktop' | 'mobile';
}

const navigationItems: Record<string, NavigationItem> = {
  home: { label: 'Home', url: '/', iconName: 'HomeIcon', isExact: true },
  statistics: {
    label: 'Statistics',
    url: '/statistics',
    iconName: 'ChartBarIcon',
    disallowedPathEndings: ['add'],
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts',
    iconName: 'Squares2X2Icon',
  },
  settings: { label: 'Settings', url: '/settings', iconName: 'Cog8ToothIcon' },
};

export const Navigation = ({
  variant = 'desktop',
  className,
}: NavigationProps) => {
  const NavigationVariant =
    variant === 'mobile' ? NavigationMobile : NavigationDesktop;

  return (
    <NavigationVariant
      navigationItems={navigationItems}
      className={className}
    />
  );
};
