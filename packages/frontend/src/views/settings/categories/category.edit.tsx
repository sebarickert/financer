import { CategoryDelete } from './category.delete';
import { CategoryForm } from './category.form';

import { TransactionCategoryDto } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface CategoryEditProps {
  category: TransactionCategoryDto;
  onSubmit: DefaultFormActionHandler;
  onDelete: () => void;
}

export const CategoryEdit = ({
  category,
  onSubmit,
  onDelete,
}: CategoryEditProps): JSX.Element => {
  return (
    <Container>
      <UpdatePageInfo
        backLink={`${settingsPaths.categories}/${category.id}`}
        headerAction={<CategoryDelete onDelete={onDelete} />}
      />
      <CategoryForm
        onSubmit={onSubmit}
        submitLabel="Update"
        currentCategoryId={category.id}
        initialValues={category}
      />
    </Container>
  );
};
