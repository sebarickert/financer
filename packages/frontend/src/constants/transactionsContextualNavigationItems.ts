import { ContextualNavigationItem } from '$blocks/ContextualNavigation';

export const transactionsContextualNavigationItems: ContextualNavigationItem[] =
  [
    { label: 'Overview', url: '/transactions/', isExact: true },
    { label: 'Incomes', url: '/transactions/incomes' },
    { label: 'Expenses', url: '/transactions/expenses' },
    { label: 'Transfers', url: '/transactions/transfers' },
  ];
