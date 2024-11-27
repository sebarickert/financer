import { FC, useMemo } from 'react';

import { TransactionCategoryDto } from '$api/generated/financerApi';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { IconName } from '$elements/Icon';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { capitalize } from '$utils/capitalize';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

type CategoryProps = {
  category: TransactionCategoryDto;
  categories: TransactionCategoryDto[];
  parentTransactionCategoryId: string;
};

export const Category: FC<CategoryProps> = ({
  category,
  categories,
  parentTransactionCategoryId,
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
    <section className="grid gap-6">
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
