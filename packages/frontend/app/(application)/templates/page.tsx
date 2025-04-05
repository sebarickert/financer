import { Layers, Plus } from 'lucide-react';
import { Metadata } from 'next';

import { getAllAccounts, getAllTransactionTemplates } from '@/api-service';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { RequireAccounts } from '@/components/RequireAccounts';
import { Button } from '@/elements/Button/Button';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { TemplateList } from '@/features/template/TemplateList';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Templates',
};

export default async function TemplateListingPage() {
  const accounts = await getAllAccounts();
  const templates = await getAllTransactionTemplates();

  const vtNames = generateNavigationViewTransitionName();

  return (
    <>
      <ContentHeader
        title="Templates"
        titleVtName={vtNames.templates}
        action={
          accounts.length > 0 && (
            <Button
              href={`/templates/add`}
              accentColor="primary"
              size="small"
              testId="add-template"
              isPill
            >
              <Plus />
              <span className="sr-only">Add</span>
              Template
            </Button>
          )
        }
      />
      <RequireAccounts>
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
      </RequireAccounts>
    </>
  );
}
