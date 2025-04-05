export const generateTransactionViewTransitionName = (
  id: string,
  field: 'name' | 'amount' | 'date',
) => `transaction-${id}-${field}`;
