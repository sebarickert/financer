import { FC, useMemo } from 'react';

import { CategoryGraph } from './category.graph';

import {
  TransactionCategoryDto,
  TransactionMonthSummaryDto,
} from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { settingsPaths } from '$constants/settings-paths';
import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { Container } from '$layouts/Container';
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
              icon: 'Squares2X2Icon' as IconName,
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
        icon: 'InformationCircleIcon',
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
            <Icon name="PencilSquareIcon" />
          </Link>
        }
      />
      <section>
        <DetailsList items={categoryDetails} className="mb-8" />
        <CategoryGraph
          transactionsMonthlySummaries={transactionsMonthlySummaries}
          category={category}
        />

        <TransactionListWithMonthlyPager
          className="mt-6"
          filterOptions={{
            parentTransactionCategory: parentTransactionCategoryId,
          }}
        />
      </section>
    </Container>
  );
};
