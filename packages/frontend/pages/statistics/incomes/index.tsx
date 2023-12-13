import { IncomeListingContainer } from '$container/incomes/income.listing.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const IncomesPage = () => {
  const {
    query: { date, page },
  } = useViewTransitionRouter();

  return (
    <IncomeListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default IncomesPage;
