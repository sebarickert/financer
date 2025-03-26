import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';

import { getAllCategories, getCategoryById } from '@/api-service';
import { Popper } from '@/elements/Popper';
import { CategoryDeleteDrawer } from '@/features/category/CategoryDeleteDrawer';
import { Layout } from '@/layouts/Layout';
import { Category } from '@/views/Category';

interface CategoryContainerProps {
  id: string;
  queryDate?: string;
}

export const CategoryContainer: FC<CategoryContainerProps> = async ({
  id,
  queryDate,
}) => {
  const allCategories = await getAllCategories();
  const category = await getCategoryById(id);

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
