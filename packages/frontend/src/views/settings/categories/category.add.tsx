import { CategoryForm } from './category.form';

import { CreateTransactionCategoryDto } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface CategoryAddProps {
  onSubmit: (newTransactionCategoryData: CreateTransactionCategoryDto) => void;
}

export const CategoryAdd = ({ onSubmit }: CategoryAddProps): JSX.Element => {
  return (
    <Container>
      <UpdatePageInfo backLink={settingsPaths.categories} />
      <CategoryForm onSubmit={onSubmit} submitLabel="Add" />
    </Container>
  );
};
