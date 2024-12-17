import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';

import { Popper } from '$elements/Popper';
import { CategoryDeleteDrawer } from '$features/category/CategoryDeleteDrawer';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/CategoryService';
import { Category } from '$views/Category';

type CategoryContainerProps = {
  id: string;
  queryDate?: string;
};

export const CategoryContainer: FC<CategoryContainerProps> = async ({
  id,
  queryDate,
}) => {
  const allCategories = await CategoryService.getAll();
  const category = await CategoryService.getById(id);

  return (
    <Layout
      title="Category Details"
      backLink={'/categories'}
      headerAction={
        <Popper
          items={[
            {
              label: 'Edit',
              href: `/categories/${category.id}/edit`,
              Icon: Pencil,
            },
            {
              label: 'Delete',
              popperId: category.id,
              Icon: Trash,
            },
          ]}
        />
      }
    >
      <Category
        category={category}
        categories={allCategories}
        parentTransactionCategoryId={id}
        queryDate={queryDate}
      />
      <CategoryDeleteDrawer id={category.id} />
    </Layout>
  );
};
