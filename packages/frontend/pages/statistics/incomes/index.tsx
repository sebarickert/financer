import { useRouter } from 'next/router';

import { IncomeListingContainer } from '$container/incomes/income-listing.container';

const IncomesPage = () => {
  const {
    query: { date, page },
  } = useRouter();

  return (
    <IncomeListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default IncomesPage;
