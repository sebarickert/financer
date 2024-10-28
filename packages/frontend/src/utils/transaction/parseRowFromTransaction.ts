import {
  TransactionListItemDto,
  TransactionType,
} from '$api/generated/financerApi';
import { TransactionListItemProps } from '$blocks/TransactionList/TransactionListItem';
import { getTransactionType } from '$utils/transaction/getTransactionType';

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
  const transactionType = getTransactionType(
    transaction.toAccount,
    transaction.fromAccount,
  );

  const categoryNames = transaction.categories.map(({ name }) => name);

  return {
    transactionCategories: categoryNames.join(', '),
    description: transaction.description,
    url: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${transaction.id}`,
    transactionType,
    date: transaction.date,
    amount: transaction.amount,
    id: transaction.id,
  };
};
