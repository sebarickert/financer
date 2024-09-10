import { FC } from 'react';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TemplateListingProps {
  templates: TransactionTemplateDto[];
}

const getLabel = (templateType: TransactionTemplateType): string => {
  switch (templateType) {
    case TransactionTemplateType.Manual:
      return 'Manual';
    case TransactionTemplateType.Auto:
      return 'Automatic';
    default:
      return 'Unknown';
  }
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
          <ButtonInternal
            link={`${settingsPaths.templates}/add`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Add template</span>
            <Icon type={IconName.plus} />
          </ButtonInternal>
        }
      />
      <section className="grid gap-8">
        {[...filteredTemplates.entries()].map(([label, items]) => (
          <LinkList label={getLabel(label)} key={label}>
            {items.map(({ templateName, id }) => (
              <LinkListLink
                icon={IconName.lightningBolt}
                key={id}
                link={`${settingsPaths.templates}/${id}/edit`}
              >
                {templateName}
              </LinkListLink>
            ))}
          </LinkList>
        ))}
      </section>
    </>
  );
};
