import { FC, useMemo } from 'react';

import { CategoryGraph } from './category.graph';

import {
  TransactionCategoryDto,
  TransactionMonthSummaryDto,
} from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { settingsPaths } from '$constants/settings-paths';
import { Icon, IconName } from '$elements/icon/icon';
import { Link } from '$elements/link/link';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

interface CategoryProps {
  transactionsMonthlySummaries?: TransactionMonthSummaryDto[];
  category: TransactionCategoryDto;
  categories: TransactionCategoryDto[];
  parentTransactionCategoryId: string;
}

export const Category: FC<CategoryProps> = ({
  transactionsMonthlySummaries,
  category,
  categories,
  parentTransactionCategoryId,
}) => {
  const categoryDetails = useMemo(() => {
    const categoryVisibilityCapitalized = category.visibility.map((item) =>
      capitalize(item),
    );

    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });

    return [
      {
        icon: IconName.tag,
        label: 'Name',
        description: category.name,
      },
      ...(category.parentCategoryId
        ? [
            {
              icon: IconName.viewGrid,
              label: 'Parent Category',
              description:
                parseParentCategoryPath(
                  categories,
                  category.parentCategoryId,
                ) ?? '-',
            },
          ]
        : []),
      {
        icon: IconName.informationCircle,
        label: 'Type',
        description: formatter.format(categoryVisibilityCapitalized),
      },
    ];
  }, [
    categories,
    category.name,
    category.parentCategoryId,
    category.visibility,
  ]);

  return (
    <Container>
      <UpdatePageInfo
        backLink={settingsPaths.categories}
        headerAction={
          <Link
            href={`${settingsPaths.categories}/${category.id}/edit`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="edit-category"
          >
            <span className="sr-only">Edit</span>
            <Icon type={IconName.pencilSquare} />
          </Link>
        }
      />
      <section>
        <DetailsList items={categoryDetails} className="mb-8" />
        <CategoryGraph
          transactionsMonthlySummaries={transactionsMonthlySummaries}
          category={category}
        />

        <TransactionListingWithMonthlyPager
          className="mt-6"
          filterOptions={{
            parentTransactionCategory: parentTransactionCategoryId,
          }}
        />
      </section>
    </Container>
  );
};
