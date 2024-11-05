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
  const filteredTemplates = Map.groupBy(
    templates,
    ({ templateType }: TransactionTemplateDto) => templateType[0],
  ) as Map<TransactionTemplateType, TransactionTemplateDto[]>;

  return (
    <section className="grid gap-8">
      {[...filteredTemplates.entries()].map(([label, items]) => (
        <List
          label={getLabel(label)}
          key={label}
          columns={2}
          testId="template-list"
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
