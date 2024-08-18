import { FC } from 'react';

import { ExpenseListingContainer } from '$container/expenses/expense.listing.container';

type ExpensesPageProps = {
  searchParams: {
    date?: string;
    page?: string;
  };
};

const ExpensesPage: FC<ExpensesPageProps> = ({
  searchParams: { date, page },
}) => {
  return (
    <ExpenseListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default ExpensesPage;
