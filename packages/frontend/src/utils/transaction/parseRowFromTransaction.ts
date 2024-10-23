import { TransactionDto, TransactionType } from '$api/generated/financerApi';
import { TransactionListItemProps } from '$blocks/TransactionList/TransactionListItem';
import { CategoryService } from '$ssr/api/category.service';
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
): Promise<TransactionListItemProps> => {
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
    description: transaction.description,
    url: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${transaction.id}`,
    transactionType,
    date: transaction.date,
    amount: transaction.amount,
    id: transaction.id,
  };
};
