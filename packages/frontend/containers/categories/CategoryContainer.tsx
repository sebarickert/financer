import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Popper } from '$elements/Popper';
import { CategoryDeleteDrawer } from '$features/category/CategoryDeleteDrawer';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/category.service';
import { Category } from '$views/Category';

type CategoryContainerProps = {
  id: string;
};

export const CategoryContainer: FC<CategoryContainerProps> = async ({ id }) => {
  const allCategories = await CategoryService.getAll();
  const category = await CategoryService.getById(id);

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
            {
              label: 'Delete',
              popperId: category.id,
              icon: 'TrashIcon',
            },
          ]}
        />
      }
    >
      <Category
        category={category}
        categories={allCategories}
        parentTransactionCategoryId={id}
      />
      <CategoryDeleteDrawer id={category.id} />
    </Layout>
  );
};
