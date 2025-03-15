import { Metadata } from 'next';

import { getCategoryNameById } from '@/api-service';
import { CategoryContainer } from '@/container/categories/CategoryContainer';
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
    title: `${name} / Categories`,
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
