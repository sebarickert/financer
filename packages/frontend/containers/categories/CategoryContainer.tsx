import { FC } from 'react';

import { CategoryDeletePopperItem } from '$blocks/CategoryDeletePopperItem';
import { settingsPaths } from '$constants/settings-paths';
import { Popper } from '$elements/Popper';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/category.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserService } from '$ssr/api/user.service';
import { Category } from '$views/Category';

type CategoryContainerProps = {
  id: string;
};

export const CategoryContainer: FC<CategoryContainerProps> = async ({ id }) => {
  const allCategories = await CategoryService.getAll();
  const category = await CategoryService.getById(id);
  const theme = await UserService.getOwnUserTheme();
  const transactionsMonthlySummaries =
    await TransactionService.getMonthlySummary({
      parentTransactionCategory: id,
    });

  return (
    <Layout
      title="Category Details"
      backLink={settingsPaths.categories}
      headerAction={
        <Popper
          items={[
            {
              label: 'Edit',
              href: `${settingsPaths.categories}/${category.id}/edit`,
              icon: 'PencilIcon',
            },
          ]}
        >
          <CategoryDeletePopperItem id={category.id} />
        </Popper>
      }
    >
      <Category
        transactionsMonthlySummaries={transactionsMonthlySummaries}
        category={category}
        categories={allCategories}
        parentTransactionCategoryId={id}
        userTheme={theme}
      />
    </Layout>
  );
};
