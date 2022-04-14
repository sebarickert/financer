import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllIncomesGroupByMonth } from '../../hooks/income/useAllIncomes';
import { formatCurrency } from '../../utils/formatCurrency';

export const Incomes = (): JSX.Element => {
  const [incomes] = useAllIncomesGroupByMonth();

  return incomes === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo title="Incomes" />
      <section className="mb-8">
        <QuickLinksItem
          title="Add income"
          link="/statistics/incomes/add"
          iconName={IconName.upload}
          iconBackgroundColor="green"
          testId="add-income"
        />
      </section>
      {incomes.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`Overview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-[-1px] z-10 bg-white py-4 -mt-4">
            <Heading>{`${monthNames[month]}, ${year}`}</Heading>
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
