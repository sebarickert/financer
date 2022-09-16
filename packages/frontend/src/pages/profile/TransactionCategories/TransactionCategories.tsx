import { useEffect, useState } from 'react';

import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategories';

export interface CategoriesListRowProps {
  label: string;
  items: CategoriesListRowItemProps[];
  link?: string;
}

export interface CategoriesListRowItemProps {
  label: string;
  link: string;
  tree: string;
  id: string;
}

const generateCategoryGroupChild = (
  childName: CategoriesListRowItemProps['label'],
  childId: CategoriesListRowItemProps['id'],
  tree: CategoriesListRowItemProps['tree'],
  showTree = true
) => ({
  id: childId,
  label: childName,
  tree: showTree ? tree : '',
  link: `/profile/transaction-categories/${childId}`,
});

export const TransactionCategories = (): JSX.Element => {
  const transactionCategoriesRaw =
    useAllTransactionCategoriesWithCategoryTree();

  const [transactionCategories, setTransactionCategories] = useState<
    CategoriesListRowProps[]
  >([]);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    const allParentIds = transactionCategoriesRaw.map(
      ({ parent_category_id }) => parent_category_id
    );

    const categoriesWithChildren = transactionCategoriesRaw
      .filter(
        ({ _id, parent_category_id }) =>
          allParentIds.includes(_id) || !!parent_category_id
      )
      .reduce((prev, { name, _id, parent_category_id, categoryTree }) => {
        if (!parent_category_id) {
          prev.push({
            ...generateCategoryGroupChild(name, _id, categoryTree, false),
            items: [],
          });
        } else {
          prev[prev.length - 1].items.push(
            generateCategoryGroupChild(name, _id, categoryTree)
          );
        }

        return prev;
      }, [] as CategoriesListRowProps[]);

    const generalCategoryGroup = {
      label: 'General',
      items: transactionCategoriesRaw
        .filter(
          ({ _id, parent_category_id }) =>
            !allParentIds.includes(_id) && !parent_category_id
        )
        .map(({ _id, name, categoryTree }) =>
          generateCategoryGroupChild(name, _id, categoryTree, false)
        ),
    };

    setTransactionCategories([generalCategoryGroup, ...categoriesWithChildren]);
  }, [transactionCategoriesRaw]);

  return (
    <>
      <UpdatePageInfo title="Categories" backLink="/profile" />
      <section className="mb-8">
        <LinkList>
          <LinkListLink
            testId="add-category"
            link="/profile/transaction-categories/add"
            icon={IconName.tag}
          >
            Add category
          </LinkListLink>
        </LinkList>
      </section>
      <section className="grid gap-12">
        {transactionCategories.map(
          ({ label: parentLabel, link: parentLink, items }) => {
            return (
              <LinkList
                label={parentLabel}
                link={parentLink}
                key={parentLabel}
                testId="category-parent-row"
              >
                {items.map(({ label, id, link, tree }) => (
                  <LinkListLink
                    link={link}
                    key={id}
                    testId="category-child-row"
                    entityTitle={label}
                  >
                    <span className="grid">
                      <span className="truncate">{label}</span>
                      <span className="text-sm font-normal text-gray-600 truncate">
                        <span className="sr-only">Tree structure: </span>
                        {tree}
                      </span>
                    </span>
                  </LinkListLink>
                ))}
              </LinkList>
            );
          }
        )}
      </section>
    </>
  );
};
