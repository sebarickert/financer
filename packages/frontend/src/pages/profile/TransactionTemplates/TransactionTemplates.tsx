import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { QuickLinksItem } from '../../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAllTransactionTemplates } from '../../../hooks/transactionTemplate/useAllTransactionTemplates';

export const TransactionTemplates = (): JSX.Element => {
  const transactionTemplatesRaw = useAllTransactionTemplates();

  return (
    <>
      <UpdatePageInfo title="Templates" backLink="/profile" />
      <section className="grid gap-8">
        <section>
          <QuickLinksItem
            title="Add templates"
            link="/profile/transaction-templates/add"
            iconName={IconName.lightningBolt}
            iconBackgroundColor="blue"
            testId="add-template"
          />
        </section>
        <LinkList testId="transaction-templates-link-list">
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
