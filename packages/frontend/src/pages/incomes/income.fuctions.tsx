import { IncomeDto } from '@local/types';

import {
  TransactionStackedListRowProps,
  TransactionType,
} from '../../components/elements/transaction-stacked-list/transaction-stacked-list.row';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export interface IncomeDtoWithCategories extends IncomeDto {
  categoryMappings: string[];
}
export interface IncomesPerMonth {
  month: number;
  total: number;
  year: number;
  rows: TransactionStackedListRowProps[];
}

export const convertIncomeToTransactionStackedListRow = (
  income: IncomeDto,
  getCategoryName: (id: string) => string | undefined
): TransactionStackedListRowProps => ({
  transactionCategories: income.categories
    .map(({ category_id }) => getCategoryName(category_id))
    .join(', '),
  transactionAmount: formatCurrency(income.amount),
  date: formatDate(new Date(income.date)),
  label: income.description,
  link: `/statistics/incomes/${income._id}`,
  transactionType: TransactionType.INCOME,
  id: income._id,
});

export const groupIncomesByMonth = (
  dateStack: IncomesPerMonth[],
  { _id, amount, date: dateRaw, description, ...rest }: IncomeDtoWithCategories
): IncomesPerMonth[] => {
  const date = new Date(dateRaw);
  const month = date.getMonth();
  const year = date.getFullYear();

  const { categoryMappings } = rest;

  const income: TransactionStackedListRowProps = {
    transactionCategories: categoryMappings?.join(', '),
    transactionAmount: formatCurrency(amount),
    date: formatDate(date),
    label: description,
    link: `/statistics/incomes/${_id}`,
    transactionType: TransactionType.INCOME,
    id: _id,
  };

  const isMonthInDateStack = dateStack.some(
    ({ month: stackMonth, year: stackYear }) =>
      month === stackMonth && year === stackYear
  );

  if (isMonthInDateStack) {
    const isTargetMonthAndYear = (targetYear: number, targetMonth: number) =>
      targetYear === year && targetMonth === month;

    return dateStack.map(
      ({
        month: stackMonth,
        year: stackYear,
        total: stackTotal,
        rows: stackRows,
      }) => ({
        month: stackMonth,
        year: stackYear,
        total: isTargetMonthAndYear(stackYear, stackMonth)
          ? stackTotal + amount
          : stackTotal,
        rows: isTargetMonthAndYear(stackYear, stackMonth)
          ? [...stackRows, income]
          : stackRows,
      })
    );
  }

  return dateStack.concat({
    year,
    month,
    total: amount,
    rows: [income],
  });
};

export const sortIncomeStacksByMonth = (
  a: IncomesPerMonth,
  b: IncomesPerMonth
): 0 | 1 | -1 => {
  if (a.year > b.year) {
    return -1;
  }

  if (b.year > a.year) {
    return 1;
  }

  if (a.month > b.month) {
    return -1;
  }

  if (b.month > a.month) {
    return 1;
  }

  return 0;
};

export const sortIncomesByDate = (stack: IncomesPerMonth): IncomesPerMonth => {
  stack.rows.sort((a, b) =>
    new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
  );

  return stack;
};
