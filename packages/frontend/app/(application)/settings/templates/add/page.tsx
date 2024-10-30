import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateAddContainer } from '$container/templates/TemplateAddContainer';

export const metadata: Metadata = {
  title: 'Add Template',
};

const AddTemplatePage: FC = () => {
  return <TemplateAddContainer />;
};

export default AddTemplatePage;
