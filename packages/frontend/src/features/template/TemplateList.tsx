import { FC } from 'react';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { IconName } from '$elements/Icon';

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

const templateIconMapping: Record<string, IconName> = {
  [TransactionTemplateType.Manual]: 'BoltIcon',
  [TransactionTemplateType.Auto]: 'ArrowPathIcon',
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
          columns={2}
          testId="template-list"
          hasItemRoundness
          hasStickyHeader
        >
          {items.map(({ templateName, id, templateType }) => (
            <ProminentLink
              icon={templateIconMapping[templateType[0]]}
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
