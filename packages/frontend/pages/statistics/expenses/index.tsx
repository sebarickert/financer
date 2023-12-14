import { ExpenseListingContainer } from '$container/expenses/expense.listing.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const ExpensesPage = () => {
  const {
    query: { date, page },
  } = useViewTransitionRouter();

  return (
    <ExpenseListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default ExpensesPage;
