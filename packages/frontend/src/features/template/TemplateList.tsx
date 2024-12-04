import { CalendarSync, Layers, LucideIcon } from 'lucide-react';
import { FC } from 'react';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';

type TemplateListProps = {
  templates: TransactionTemplateDto[];
};

const getLabel = (templateType: TransactionTemplateType): string => {
  switch (templateType) {
    case TransactionTemplateType.Auto:
      return 'Recurring Templates';
    default:
      return '';
  }
};

const TEMPLATE_ICON_MAPPING: Record<string, LucideIcon> = {
  [TransactionTemplateType.Manual]: Layers,
  [TransactionTemplateType.Auto]: CalendarSync,
};

export const TemplateList: FC<TemplateListProps> = ({ templates }) => {
  const groupedTemplates = Object.entries(
    Object.groupBy(templates, ({ templateType }) => templateType[0]),
  )
    .map(([type, items]) => ({ type, items }))
    .sort((a) => (a.type === 'MANUAL' ? -1 : 1)); // MANUAL templates should be first

  return (
    <section className="grid gap-8">
      {groupedTemplates.map(({ type, items }) => (
        <List
          label={getLabel(type as TransactionTemplateType)}
          key={type}
          testId="template-list"
        >
          {items.map(({ templateName, id, templateType }) => (
            <ProminentLink
              Icon={TEMPLATE_ICON_MAPPING[templateType[0]]}
              key={id}
              link={`${settingsPaths.templates}/${id}/edit`}
            >
              {templateName}
            </ProminentLink>
          ))}
        </List>
      ))}
    </section>
  );
};
