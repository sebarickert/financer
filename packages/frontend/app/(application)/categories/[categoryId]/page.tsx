import { Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Popper } from '@/elements/Popper';
import { CategoryDeleteDrawer } from '@/features/category/CategoryDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { CategoryService } from '@/ssr/api/CategoryService';
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
  const category = await CategoryService.getById(categoryId);

  return {
    title: category.name,
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

  const category = await CategoryService.getById(categoryId);

  if (!category) {
    notFound();
  }

  const allCategories = await CategoryService.getAll();

  return (
    <>
      <ContentHeader
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
