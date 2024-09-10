import { FC } from 'react';

import { TransactionTemplateService } from '$ssr/api/transaction-template.service';
import { TemplateListing } from '$views/settings/templates/template.listing';

export const TemplateListingContainer: FC = async () => {
  const templates = await TransactionTemplateService.getAll();

  return <TemplateListing templates={templates} />;
};
