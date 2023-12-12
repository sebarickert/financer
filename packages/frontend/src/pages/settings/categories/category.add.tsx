import { CategoryForm } from './category.form';

import { CreateTransactionCategoryDto } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface CategoryAddProps {
  errors: string[];
  isLoading: boolean;
  onSubmit: (newTransactionCategoryData: CreateTransactionCategoryDto) => void;
}

export const CategoryAdd = ({
  onSubmit,
  errors,
  isLoading,
}: CategoryAddProps): JSX.Element => {
  return (
    <Container>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add Category"
        backLink={settingsPaths.categories}
      />
      <CategoryForm onSubmit={onSubmit} errors={errors} submitLabel="Add" />
    </Container>
  );
};