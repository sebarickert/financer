import { Metadata } from 'next';

import { CategoryContainer } from '$container/categories/CategoryContainer';
import { CategoryService } from '$ssr/api/CategoryService';

type Params = Promise<{
  categoryId: string;
}>;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { categoryId } = await params;
  const category = await CategoryService.getById(categoryId);

  return {
    title: `${category.name} / Categories`,
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

  return <CategoryContainer id={categoryId} queryDate={queryDate} />;
}
