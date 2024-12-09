import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Popper } from '$elements/Popper';
import { CategoryDeleteDrawer } from '$features/category/CategoryDeleteDrawer';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { CategoryService } from '$ssr/api/CategoryService';
import { Category } from '$views/Category';

type CategoryContainerProps = {
  id: string;
};

export const CategoryContainer: FC<CategoryContainerProps> = async ({ id }) => {
  const allCategories = await CategoryService.getAll();
  const category = await CategoryService.getById(id);

  return (
    <SettingsLayout
      title="Category Details"
      backLink={settingsPaths.categories}
      headerAction={
        <Popper
          items={[
            {
              label: 'Edit',
              href: `${settingsPaths.categories}/${category.id}/edit`,
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
      />
      <CategoryDeleteDrawer id={category.id} />
    </SettingsLayout>
  );
};
