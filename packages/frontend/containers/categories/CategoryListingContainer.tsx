import { Plus, Tag } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { Button } from '$elements/Button/Button';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/CategoryService';

const generateCategoryGroupChild = (
  childName: CategoryItem['label'],
  childId: CategoryItem['id'],
  tree: CategoryItem['tree'],
  showTree = true,
) => ({
  id: childId,
  label: childName,
  tree: showTree ? tree : '',
  link: `/categories/${childId}`,
});

type CategoryParentItem = {
  label: string;
  items: CategoryItem[];
  link?: string;
};

type CategoryItem = {
  label: string;
  link: string;
  tree: string;
  id: string;
};

export const CategoryListingContainer: FC = async () => {
  const categories = await CategoryService.getAllWithTree();

  const allParentIds = categories.map(
    ({ parentCategoryId }) => parentCategoryId,
  );

  const categoriesWithChildren = categories
    .filter(
      ({ id, parentCategoryId }) =>
        allParentIds.includes(id) || !!parentCategoryId,
    )
    .reduce((prev, { name, id, parentCategoryId, categoryTree }) => {
      if (!parentCategoryId) {
        prev.push({
          ...generateCategoryGroupChild(name, id, categoryTree, false),
          items: [],
        });
      } else {
        prev[prev.length - 1].items.push(
          generateCategoryGroupChild(name, id, categoryTree),
        );
      }

      return prev;
    }, [] as CategoryParentItem[]);

  const generalCategoryGroup = {
    label: 'General',
    items: categories
      .filter(
        ({ id, parentCategoryId }) =>
          !allParentIds.includes(id) && !parentCategoryId,
      )
      .map(({ id, name, categoryTree }) =>
        generateCategoryGroupChild(name, id, categoryTree, false),
      ),
  };

  const categoryRows: CategoryParentItem[] = [
    ...(!!generalCategoryGroup.items.length ? [generalCategoryGroup] : []),
    ...categoriesWithChildren,
  ];

  return (
    <Layout
      title="Categories"
      headerAction={
        <Button
          href={`/categories/add`}
          accentColor="secondary"
          size="icon"
          className="max-lg:button-ghost"
        >
          <span className="sr-only">Add category</span>
          <Plus />
        </Button>
      }
    >
      <section className="grid gap-6">
        {!categoryRows.length && (
          <InfoMessageBlock
            title="No Categories Added"
            Icon={Tag}
            action={<Button href={`/categories/add`}>Add Category</Button>}
          >
            It seems you haven&apos;t added any categories yet. Start by adding
            your first category to begin organizing and tracking your finances
            more effectively.
          </InfoMessageBlock>
        )}
        {categoryRows.map(({ label: parentLabel, items, link: parentLink }) => (
          <List key={parentLabel} label={parentLabel} testId="category-list">
            {parentLink && (
              <ProminentLink link={parentLink} Icon={Tag}>
                {parentLabel}
              </ProminentLink>
            )}
            {items.map(({ id, link, label }) => (
              <ProminentLink key={id} link={link} Icon={Tag}>
                {label}
              </ProminentLink>
            ))}
          </List>
        ))}
      </section>
    </Layout>
  );
};
