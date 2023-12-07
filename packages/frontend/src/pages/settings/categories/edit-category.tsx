import { CategoryForm } from './category-form';

import {
  TransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface EditCategoryProps {
  errors: string[];
  isLoading: boolean;
  category: TransactionCategoryDto;
  onSubmit: (newTransactionCategoryData: UpdateTransactionCategoryDto) => void;
}

export const EditCategory = ({
  errors,
  category,
  isLoading,
  onSubmit,
}: EditCategoryProps): JSX.Element => {
  return (
    <Container>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Edit transaction category"
        backLink={`/profile/transaction-categories/${category._id}`}
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
