import { Layers, Plus } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/Button/Button';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { TemplateList } from '$features/template/TemplateList';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';

export const TemplateListingContainer: FC = async () => {
  const templates = await TransactionTemplateService.getAll();

  return (
    <SettingsLayout
      title="Templates"
      headerAction={
        <Button
          href={`${settingsPaths.templates}/add`}
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
    </SettingsLayout>
  );
};
