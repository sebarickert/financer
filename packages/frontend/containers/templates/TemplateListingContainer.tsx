import { Layers, Plus } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { Button } from '$elements/Button/Button';
import { TemplateList } from '$features/template/TemplateList';
import { Layout } from '$layouts/Layout';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';

export const TemplateListingContainer: FC = async () => {
  const templates = await TransactionTemplateService.getAll();

  return (
    <Layout
      title="Templates"
      headerAction={
        <Button
          href={`/templates/add`}
          accentColor="secondary"
          size="icon"
          testId="add-template"
          className="max-lg:button-ghost"
        >
          <span className="sr-only">Add template</span>
          <Plus />
        </Button>
      }
    >
      {!templates.length && (
        <InfoMessageBlock
          title="No Templates Added"
          Icon={Layers}
          action={<Button href={`/templates/add`}>Add Template</Button>}
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
