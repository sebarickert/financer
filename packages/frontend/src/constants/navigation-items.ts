import { IconName } from '$elements/icon/icon';

export const navigationItems = {
  home: { label: 'Home', url: '/', iconName: IconName.home },
  statistics: {
    label: 'Statistics',
    url: '/statistics',
    iconName: IconName.chartBar,
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts',
    iconName: IconName.viewGrid,
  },
  settings: { label: 'Settings', url: '/settings', iconName: IconName.cog },
};
