import { FC } from 'react';

import { CategoryForm } from './category.form';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface CategoryAddProps {
  onSubmit: DefaultFormActionHandler;
}

export const CategoryAdd: FC<CategoryAddProps> = ({ onSubmit }) => {
  return (
    <Container>
      <UpdatePageInfo backLink={settingsPaths.categories} />
      <CategoryForm onSubmit={onSubmit} submitLabel="Add" />
    </Container>
  );
};
