import { useRouter } from 'next/router';

import { ExpenseListingContainer } from '$container/expenses/expense-listing.container';

const ExpensesPage = () => {
  const {
    query: { date, page },
  } = useRouter();

  return (
    <ExpenseListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default ExpensesPage;
