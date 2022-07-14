export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  ANY = 'any',
}

export const TransactionTypeMapping: { [key in TransactionType]: string } = {
  income: 'incomes',
  expense: 'expenses',
  transfer: 'transfers',
  any: 'any',
};
