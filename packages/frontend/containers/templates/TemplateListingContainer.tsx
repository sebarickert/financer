import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
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
          className="max-lg:button-ghost"
        >
          <span className="sr-only">Add template</span>
          <Icon name="PlusIcon" />
        </Button>
      }
    >
      {!templates.length && (
        <InfoMessageBlock
          title="No Templates Added"
          icon="BoltIcon"
          action={
            <Button href={`${settingsPaths.templates}/add`}>
              Add Template
            </Button>
          }
        >
          It seems you haven&apos;t added any templates yet. Create your first
          template to predefine values or automate common transactions, making
          it easier to track recurring expenses and income.
        </InfoMessageBlock>
      )}
      <TemplateList templates={templates} />
    </Layout>
  );
};
