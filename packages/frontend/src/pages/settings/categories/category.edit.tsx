import { CategoryDelete } from './category.delete';
import { CategoryForm } from './category.form';

import {
  TransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface EditCategoryProps {
  errors: string[];
  isLoading: boolean;
  category: TransactionCategoryDto;
  onSubmit: (newTransactionCategoryData: UpdateTransactionCategoryDto) => void;
  onDelete: () => void;
}

export const CategoryEdit = ({
  errors,
  category,
  isLoading,
  onSubmit,
  onDelete,
}: EditCategoryProps): JSX.Element => {
  return (
    <Container>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`Edit ${category.name}`}
        backLink={`${settingsPaths.categories}/${category._id}`}
        headerAction={<CategoryDelete onDelete={onDelete} />}
      />
      <CategoryForm
        onSubmit={onSubmit}
        errors={errors}
        submitLabel="Update"
        currentCategoryId={category._id}
        initialValues={category}
      />
    </Container>
  );
};
