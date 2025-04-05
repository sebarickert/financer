import { CalendarSync, Layers, LucideIcon } from 'lucide-react';
import { FC } from 'react';

import {
  SchemaTransactionTemplateDto,
  TransactionTemplateType,
} from '@/api/ssr-financer-api';
import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { generateTemplateViewTransitionName } from '@/features/template/generateTemplateViewTransitionName';

interface TemplateListProps {
  templates: SchemaTransactionTemplateDto[];
}

const getLabel = (templateType: TransactionTemplateType): string => {
  switch (templateType) {
    case TransactionTemplateType.AUTO:
      return 'Recurring Templates';
    default:
      return '';
  }
};

const TEMPLATE_ICON_MAPPING: Record<string, LucideIcon> = {
  [TransactionTemplateType.MANUAL]: Layers,
  [TransactionTemplateType.AUTO]: CalendarSync,
};

export const TemplateList: FC<TemplateListProps> = ({ templates }) => {
  const groupedTemplates = Object.entries(
    Object.groupBy(templates, ({ templateType }) => templateType[0]),
  )
    .map(([type, items]) => ({ type, items }))
    .sort((a) => (a.type === 'MANUAL' ? -1 : 1)); // MANUAL templates should be first

  return (
    <section className="grid gap-6">
      {groupedTemplates.map(({ type, items }) => (
        <List
          label={getLabel(type as TransactionTemplateType)}
          key={type}
          testId="template-list"
        >
          {items.map(({ templateName, id, templateType }) => {
            const vtNames = generateTemplateViewTransitionName(id);
            return (
              <ProminentLink
                Icon={TEMPLATE_ICON_MAPPING[templateType[0]]}
                key={id}
                link={`/templates/${id}`}
                vtName={vtNames.name}
              >
                {templateName}
              </ProminentLink>
            );
          })}
        </List>
      ))}
    </section>
  );
};
