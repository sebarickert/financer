import { TransactionTemplateDto } from '$api/generated/financerApi';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TemplateListingProps {
  templates: TransactionTemplateDto[];
}

export const TemplateListing = ({
  templates,
}: TemplateListingProps): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Templates" backLink="/profile" />
      <section className="grid gap-8">
        <section>
          <LinkList>
            <LinkListLink
              testId="add-template"
              link="/profile/transaction-templates/add"
              icon={IconName.lightningBolt}
            >
              Add template
            </LinkListLink>
          </LinkList>
        </section>
        <LinkList testId="transaction-templates-link-list" label="Shortcuts">
          {templates.map(({ templateName, _id: id }) => (
            <LinkListLink
              link={`/profile/transaction-templates/${id}/edit`}
              key={id}
              testId="transaction-templates-row"
            >
              {templateName}
            </LinkListLink>
          ))}
        </LinkList>
      </section>
    </>
  );
};
