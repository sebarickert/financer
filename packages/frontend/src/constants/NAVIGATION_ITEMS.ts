import { Activity, Grid2X2, Home, LucideIcon, UserCog } from 'lucide-react';

export type NavigationItem = {
  label: string;
  url: string;
  Icon: LucideIcon;
};

export const NAVIGATION_ITEMS: Record<string, NavigationItem> = {
  home: { label: 'Home', url: '/', Icon: Home },
  transactions: {
    label: 'Transactions',
    url: '/transactions/',
    Icon: Activity,
  },
  statistics: {
    label: 'Statistics',
    url: '/statistics/',
    Icon: Activity,
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts/',
    Icon: Grid2X2,
  },
  settings: { label: 'Settings', url: '/settings/', Icon: UserCog },
};
