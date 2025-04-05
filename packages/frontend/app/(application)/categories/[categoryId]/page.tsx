import { Menu, Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getAllCategories,
  getCategoryById,
  getCategoryNameById,
} from '@/api-service';
import { Popper } from '@/elements/Popper';
import { PopperItem } from '@/elements/PopperItem';
import { CategoryDeleteDrawer } from '@/features/category/CategoryDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Category } from '@/views/Category';

type Params = Promise<{
  categoryId: string;
}>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { categoryId } = await params;
  const name = await getCategoryNameById(categoryId);

  return {
    title: name,
  };
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { categoryId } = await params;
  const queryDate = (await searchParams).date as string | undefined;

  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const allCategories = await getAllCategories();

  return (
    <>
      <ContentHeader
        title={category.name}
        action={
          <Popper
            popperButton={{
              isPill: true,
              size: 'small',
              accentColor: 'secondary',
              content: (
                <>
                  <Menu />
                  Options
                </>
              ),
            }}
          >
            <PopperItem
              label="Edit"
              href={`/categories/${category.id}/edit`}
              icon={Pencil}
            />
            <PopperItem label="Delete" icon={Trash} popperId={category.id} />
          </Popper>
        }
      />
      <Category
        category={category}
        categories={allCategories}
        parentTransactionCategoryId={categoryId}
        queryDate={queryDate}
      />
      <CategoryDeleteDrawer id={category.id} />
    </>
  );
}
