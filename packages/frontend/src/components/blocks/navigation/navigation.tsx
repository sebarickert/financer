import { NavigationDesktop } from './navigation.desktop';
import { NavigationMobile } from './navigation.mobile';

import { IconName } from '$elements/icon/icon';

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

const navigationItems = {
  home: { label: 'Home', url: '/', iconName: IconName.home, isExact: true },
  statistics: {
    label: 'Statistics',
    url: '/statistics',
    iconName: IconName.chartBar,
    disallowedPathEndings: ['add'],
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts',
    iconName: IconName.viewGrid,
  },
  settings: { label: 'Settings', url: '/settings', iconName: IconName.cog },
} as Record<string, NavigationItem>;

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
