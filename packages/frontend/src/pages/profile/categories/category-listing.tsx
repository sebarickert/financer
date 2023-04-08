import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

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

interface CategoryListingProps {
  categories: CategoriesListRowProps[];
}

export const CategoryListing = ({
  categories,
}: CategoryListingProps): JSX.Element => {
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
        {categories.map(({ label: parentLabel, link: parentLink, items }) => {
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
                    <span className="text-black truncate">{label}</span>
                    <span className="text-sm font-normal tracking-tight truncate text-gray-darkest">
                      <span className="sr-only">Tree structure: </span>
                      {tree}
                    </span>
                  </span>
                </LinkListLink>
              ))}
            </LinkList>
          );
        })}
      </section>
    </>
  );
};
