import { ContextualNavigationItem } from '$blocks/ContextualNavigation';

export const statisticsContextualNavigationItems: ContextualNavigationItem[] = [
  { label: 'Transactions', url: '/statistics/', isExact: true },
  { label: 'Overview', url: '/statistics/overview/' },
  { label: 'Incomes', url: '/statistics/incomes/' },
  { label: 'Expenses', url: '/statistics/expenses/' },
  { label: 'Transfers', url: '/statistics/transfers/' },
];
