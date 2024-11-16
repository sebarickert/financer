import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { TemplateList } from '$features/template/TemplateList';
import { Layout } from '$layouts/Layout';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';

export const TemplateListingContainer: FC = async () => {
  const templates = await TransactionTemplateService.getAll();

  return (
    <Layout
      title="Templates"
      backLink={settingsPaths.default}
      headerAction={
        <Button
          href={`${settingsPaths.templates}/add`}
          accentColor="secondary"
          size="icon"
          testId="add-template"
        >
          <span className="sr-only">Add template</span>
          <Icon name="PlusIcon" />
        </Button>
      }
    >
      <TemplateList templates={templates} />
    </Layout>
  );
};
