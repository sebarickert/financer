import { FC } from 'react';

import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { CategoryService } from '$ssr/api/category.service';

const generateCategoryGroupChild = (
  childName: CategoryItem['label'],
  childId: CategoryItem['id'],
  tree: CategoryItem['tree'],
  showTree = true,
) => ({
  id: childId,
  label: childName,
  tree: showTree ? tree : '',
  link: `${settingsPaths.categories}/${childId}`,
});

interface CategoryParentItem {
  label: string;
  items: CategoryItem[];
  link?: string;
}

interface CategoryItem {
  label: string;
  link: string;
  tree: string;
  id: string;
}

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
    generalCategoryGroup,
    ...categoriesWithChildren,
  ];

  return (
    <>
      <UpdatePageInfo
        backLink={settingsPaths.default}
        headerAction={
          <Link
            href={`${settingsPaths.categories}/add`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-category-link"
          >
            <span className="sr-only">Add category</span>
            <Icon name="PlusIcon" />
          </Link>
        }
      />
      <section className="grid gap-8">
        {categoryRows.map(({ label: parentLabel, items, link: parentLink }) => (
          <List
            key={parentLabel}
            label={parentLabel}
            testId="category-list"
            columns={2}
          >
            {parentLink && (
              <ProminentLink link={parentLink} icon={'TagIcon'}>
                {parentLabel}
              </ProminentLink>
            )}
            {items.map(({ id, link, label }) => (
              <ProminentLink key={id} link={link} icon={'TagIcon'}>
                {label}
              </ProminentLink>
            ))}
          </List>
        ))}
      </section>
    </>
  );
};
