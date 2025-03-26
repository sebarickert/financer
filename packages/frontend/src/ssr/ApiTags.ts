export const API_TAG = {
  APP: 'app',
  ACCOUNT: 'account',
  AUTHENTICATION: 'authentication',
  USER: 'user',
  USER_PREFERENCE: 'user-preference',
  TRANSACTION_TEMPLATE: 'transaction-template',
  TRANSACTION: 'transaction',
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  CATEGORY: 'category',
} as const;

export const getEntityTag = (
  tag: (typeof API_TAG)[keyof typeof API_TAG],
  id: string,
): string => {
  return `${tag}:id:${id}`;
};
