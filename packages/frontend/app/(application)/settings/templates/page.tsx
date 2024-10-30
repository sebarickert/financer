import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateListingContainer } from '$container/templates/TemplateListingContainer';

export const metadata: Metadata = {
  title: 'Templates',
};

const TemplateListingPage: FC = () => {
  return <TemplateListingContainer />;
};

export default TemplateListingPage;
