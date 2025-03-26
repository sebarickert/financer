import { ContextualNavigationItem } from '@/blocks/ContextualNavigation';

export const transactionsContextualNavigationItems: ContextualNavigationItem[] =
  [
    { label: 'Overview', url: '/transactions/', isExact: true },
    { label: 'Statistics', url: '/statistics' },
  ];
