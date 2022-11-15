import { IconName } from '../../../components/elements/icon/icon';
import { LinkList } from '../../../components/elements/link-list/link-list';
import { LinkListLink } from '../../../components/elements/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/renderers/seo/updatePageInfo';
import { useAllTransactionTemplates } from '../../../hooks/transactionTemplate/useAllTransactionTemplates';

export const TransactionTemplates = (): JSX.Element => {
  const transactionTemplatesRaw = useAllTransactionTemplates();

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
          {transactionTemplatesRaw.map(({ templateName, _id: id }) => (
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
