import { TransactionListingItemProps } from './transaction-listing.item';

import { TransactionDto, TransactionType } from '$api/generated/financerApi';
import { CategoryService } from '$ssr/api/category.service';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';
import { getTransactionType } from '$utils/transaction/getTransactionType';

type TransactionDtoForConvert = Omit<
  TransactionDto,
  'fromAccount' | 'toAccount'
> & {
  fromAccount?: string;
  toAccount?: string;
};

const mapTransactionTypeToUrlPrefix: {
  [key in TransactionType]: 'incomes' | 'expenses' | 'transfers';
} = {
  INCOME: 'incomes',
  EXPENSE: 'expenses',
  TRANSFER: 'transfers',
};

export const parseRowFromTransaction = async (
  transaction: TransactionDtoForConvert,
): Promise<TransactionListingItemProps> => {
  const transactionType = getTransactionType(
    transaction.toAccount,
    transaction.fromAccount,
  );

  const categoryNames = await Promise.all(
    transaction.categories.map(({ categoryId }) =>
      CategoryService.getNameById(categoryId),
    ),
  );

  return {
    transactionCategories: categoryNames.join(', '),
    transactionAmount: formatCurrency(transaction.amount),
    date: formatDate(new Date(transaction.date)),
    label: transaction.description,
    link: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${transaction.id}`,
    transactionType,
    id: transaction.id,
  };
};
