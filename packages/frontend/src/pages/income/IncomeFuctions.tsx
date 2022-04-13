import { IncomeDto } from '@local/types';

import { ITransactionStackedListRowProps } from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export interface IIncomeWithCategories extends IncomeDto {
  categoryMappings: string[];
}
export interface IIncomesPerMonth {
  month: number;
  total: number;
  year: number;
  rows: ITransactionStackedListRowProps[];
}

export const groupIncomesByMonth = (
  dateStack: IIncomesPerMonth[],
  { _id, amount, date: dateRaw, description, ...rest }: IIncomeWithCategories
): IIncomesPerMonth[] => {
  const date = new Date(dateRaw);
  const month = date.getMonth();
  const year = date.getFullYear();

  const { categoryMappings } = rest;

  const income: ITransactionStackedListRowProps = {
    transactionCategories: categoryMappings?.join(', '),
    transactionAmount: formatCurrency(amount),
    date: formatDate(date),
    label: description,
    link: `/statistics/incomes/${_id}`,
    transactionType: 'income',
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
  a: IIncomesPerMonth,
  b: IIncomesPerMonth
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

export const sortIncomesByDate = (
  stack: IIncomesPerMonth
): IIncomesPerMonth => {
  stack.rows.sort((a, b) =>
    new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
  );

  return stack;
};
