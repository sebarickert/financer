import { Plus, Tag } from 'lucide-react';
import { Metadata } from 'next';

import { getAllCategoriesWithTree } from '@/api-service';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { Button } from '@/elements/Button/Button';
import { generateCategoryViewTransitionName } from '@/features/category/generateCategoryViewTransitionName';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Categories',
};

interface CategoryParentItem {
  label: string;
  items: CategoryItem[];
  id?: string;
  link?: string;
}

interface CategoryItem {
  label: string;
  link: string;
  tree: string;
  id: string;
}

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

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithTree();

  const allParentIds = categories.map(
    ({ parentCategoryId }) => parentCategoryId,
  );

  const categoriesWithChildren = categories
    .filter(
      ({ id, parentCategoryId }) =>
        allParentIds.includes(id) || !!parentCategoryId,
    )
    .reduce<CategoryParentItem[]>(
      (prev, { name, id, parentCategoryId, categoryTree }) => {
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
      },
      [],
    );

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
    ...(generalCategoryGroup.items.length ? [generalCategoryGroup] : []),
    ...categoriesWithChildren,
  ];

  const vtNames = generateNavigationViewTransitionName();

  return (
    <>
      <ContentHeader
        title="Categories"
        titleVtName={vtNames.categories}
        action={
          <Button
            href={`/categories/add`}
            accentColor="primary"
            size="small"
            isPill
          >
            <Plus />
            <span className="sr-only">Add</span>
            Category
          </Button>
        }
      />
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
        {categoryRows.map(
          ({ label: parentLabel, items, link: parentLink, id: parentId }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const parentVtNames = generateCategoryViewTransitionName(parentId!);
            return (
              <List
                key={parentLabel}
                label={parentLabel}
                testId="category-list"
              >
                {parentLink && (
                  <ProminentLink
                    link={parentLink}
                    Icon={Tag}
                    vtName={parentVtNames.name}
                  >
                    {parentLabel}
                  </ProminentLink>
                )}
                {items.map(({ id, link, label }) => {
                  const vtNames = generateCategoryViewTransitionName(id);
                  return (
                    <ProminentLink
                      key={id}
                      link={link}
                      Icon={Tag}
                      vtName={vtNames.name}
                    >
                      {label}
                    </ProminentLink>
                  );
                })}
              </List>
            );
          },
        )}
      </section>
    </>
  );
}
