import { DetailsList } from '$blocks/details-list/details-list';
import { useGetMonthlyDetails } from '$hooks/transaction/useGetMonthlyDetails';

interface TransactionListingWithMonthlyPagerSummaryProps {
  // @todo: create filterOptions type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOptions: any;
}

export const TransactionListingWithMonthlyPagerSummary = ({
  filterOptions,
}: TransactionListingWithMonthlyPagerSummaryProps): JSX.Element | null => {
  const monthlyDetails = useGetMonthlyDetails(filterOptions);

  return (
    <DetailsList
      items={monthlyDetails}
      className="mb-4 py-4 border-t border-b border-gray-dark"
    />
  );
};
