import {
  TransactionListItemDto,
  TransactionType,
} from '$api/generated/financerApi';
import { TransactionListItemProps } from '$modules/transaction/TransactionList/TransactionListItem';

const mapTransactionTypeToUrlPrefix: {
  [key in TransactionType]: 'incomes' | 'expenses' | 'transfers';
} = {
  INCOME: 'incomes',
  EXPENSE: 'expenses',
  TRANSFER: 'transfers',
};

export const parseRowFromTransaction = async (
  transaction: TransactionListItemDto,
): Promise<TransactionListItemProps> => {
  const categoryNames = transaction.categories.map(({ name }) => name);

  return {
    transactionCategories: categoryNames.join(', '),
    description: transaction.description,
    url: `/statistics/${mapTransactionTypeToUrlPrefix[transaction.type]}/${transaction.id}`,
    transactionType: transaction.type,
    date: transaction.date,
    amount: transaction.amount,
    id: transaction.id,
    isRecurring: transaction.isRecurring,
  };
};
