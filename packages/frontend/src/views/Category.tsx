import { FC, useMemo } from 'react';

import {
  Theme,
  TransactionCategoryDto,
  TransactionMonthSummaryDto,
} from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { IconName } from '$elements/Icon';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { CategoryGraph } from '$features/category/CategoryGraph';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { capitalize } from '$utils/capitalize';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

type CategoryProps = {
  transactionsMonthlySummaries?: TransactionMonthSummaryDto[];
  category: TransactionCategoryDto;
  categories: TransactionCategoryDto[];
  parentTransactionCategoryId: string;
  userTheme: Theme;
};

export const Category: FC<CategoryProps> = ({
  transactionsMonthlySummaries,
  category,
  categories,
  parentTransactionCategoryId,
  userTheme,
}) => {
  const categoryDetails: DetailsItem[] = useMemo(() => {
    const categoryVisibilityCapitalized = category.visibility.map((item) =>
      capitalize(item),
    );

    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });

    return [
      {
        icon: 'TagIcon' as IconName,
        label: 'Name',
        description: category.name,
      },
      ...(category.parentCategoryId
        ? [
            {
              icon: 'TagIcon' as IconName,
              label: 'Parent Category',
              description:
                parseParentCategoryPath(
                  categories,
                  category.parentCategoryId,
                ) ?? '-',
            },
          ]
        : []),
      ...(categoryVisibilityCapitalized.length > 0
        ? [
            {
              icon: 'InformationCircleIcon' as IconName,
              label:
                categoryVisibilityCapitalized.length > 1
                  ? 'Transaction Types'
                  : 'Transaction Type',
              description: formatter.format(categoryVisibilityCapitalized),
            },
          ]
        : []),
    ];
  }, [
    categories,
    category.name,
    category.parentCategoryId,
    category.visibility,
  ]);

  return (
    <section className="grid gap-8">
      <LoaderSuspense>
        <CategoryGraph
          transactionsMonthlySummaries={transactionsMonthlySummaries}
          category={category}
          userTheme={userTheme}
        />
      </LoaderSuspense>
      <div className="p-6 rounded-md bg-layer">
        <DetailsList items={categoryDetails} />
      </div>
      <TransactionListWithMonthlyPager
        filterOptions={{
          parentTransactionCategory: parentTransactionCategoryId,
        }}
      />
    </section>
  );
};
