import { FC } from 'react';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TemplateListingProps {
  templates: TransactionTemplateDto[];
}

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

export const TemplateListing: FC<TemplateListingProps> = ({ templates }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredTemplates = (Map as any).groupBy(
    templates,
    ({ templateType }: TransactionTemplateDto) => templateType[0],
  ) as Map<TransactionTemplateType, TransactionTemplateDto[]>;

  return (
    <>
      <UpdatePageInfo
        backLink={settingsPaths.default}
        headerAction={
          <Link
            href={`${settingsPaths.templates}/add`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Add template</span>
            <Icon name="PlusIcon" />
          </Link>
        }
      />
      <section className="grid gap-8">
        {[...filteredTemplates.entries()].map(([label, items]) => (
          <List label={getLabel(label)} key={label} columns={2}>
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
    </>
  );
};
