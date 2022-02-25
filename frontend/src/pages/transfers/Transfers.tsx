import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllTransfersGroupByMonth } from '../../hooks/transfer/useAllTransfers';
import { formatCurrency } from '../../utils/formatCurrency';

export const Transfers = (): JSX.Element => {
  const transfers = useAllTransfersGroupByMonth();

  return transfers === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Transfers" />
      <Banner title="Transfers" headindType="h1" className="mb-8">
        <BannerText>Overview page for your transfer transactions.</BannerText>
        <Button
          link="/statistics/transfers/add"
          className="mt-6"
          testId="add-transfer"
        >
          Add transfer
        </Button>
      </Banner>
      {transfers.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4 -mt-4">
            <h2 className="text-2xl font-bold tracking-tighter truncate sm:text-3xl">
              {`${monthNames[month]}, ${year}`}
            </h2>
            <p className="font-semibold text-gray-600">
              <span className="sr-only">Total: </span>
              {Number.isNaN(total) ? '-' : formatCurrency(total)}
            </p>
          </div>
          <TransactionStackedList rows={rows} />
        </section>
      ))}
    </>
  );
};
