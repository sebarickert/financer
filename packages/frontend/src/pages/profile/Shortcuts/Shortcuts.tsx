import { IconName } from '../../../components/icon/icon';
import { QuickLinksItem } from '../../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';

// export interface CategoriesListRowProps {
//   label: string;
//   items: CategoriesListRowItemProps[];
//   link?: string;
// }

// export interface CategoriesListRowItemProps {
//   label: string;
//   link: string;
//   tree: string;
//   id: string;
// }

// const generateCategoryGroupChild = (
//   childName: CategoriesListRowItemProps['label'],
//   childId: CategoriesListRowItemProps['id'],
//   tree: CategoriesListRowItemProps['tree'],
//   showTree = true
// ) => ({
//   id: childId,
//   label: childName,
//   tree: showTree ? tree : '',
//   link: `/profile/transaction-categories/${childId}/edit`,
// });

export const Shortcuts = (): JSX.Element => {
  // const transactionCategoriesRaw =
  //   useAllTransactionCategoriesWithCategoryTree();

  // const [transactionCategories, setTransactionCategories] = useState<
  //   CategoriesListRowProps[]
  // >([]);

  // useEffect(() => {
  //   if (transactionCategoriesRaw === null) return;

  //   const allParentIds = transactionCategoriesRaw.map(
  //     ({ parent_category_id }) => parent_category_id
  //   );

  //   const categoriesWithChildren = transactionCategoriesRaw
  //     .filter(
  //       ({ _id, parent_category_id }) =>
  //         allParentIds.includes(_id) || !!parent_category_id
  //     )
  //     .reduce((prev, { name, _id, parent_category_id, categoryTree }) => {
  //       if (!parent_category_id) {
  //         prev.push({
  //           ...generateCategoryGroupChild(name, _id, categoryTree, false),
  //           items: [],
  //         });
  //       } else {
  //         prev[prev.length - 1].items.push(
  //           generateCategoryGroupChild(name, _id, categoryTree)
  //         );
  //       }

  //       return prev;
  //     }, [] as CategoriesListRowProps[]);

  //   const generalCategoryGroup = {
  //     label: 'General',
  //     items: transactionCategoriesRaw
  //       .filter(
  //         ({ _id, parent_category_id }) =>
  //           !allParentIds.includes(_id) && !parent_category_id
  //       )
  //       .map(({ _id, name, categoryTree }) =>
  //         generateCategoryGroupChild(name, _id, categoryTree, false)
  //       ),
  //   };

  //   setTransactionCategories([generalCategoryGroup, ...categoriesWithChildren]);
  // }, [transactionCategoriesRaw]);

  return (
    <>
      <UpdatePageInfo title="Shortcuts" backLink="/profile" />
      <section className="grid gap-8">
        <section>
          <QuickLinksItem
            title="Add shortcut"
            link="/profile/shortcuts/add"
            iconName={IconName.lightningBolt}
            iconBackgroundColor="blue"
            testId="add-shortcut"
          />
        </section>
        {/* {transactionCategories.map(
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
        )} */}
      </section>
    </>
  );
};
