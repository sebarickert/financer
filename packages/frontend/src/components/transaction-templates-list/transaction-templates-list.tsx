import { TransactionTypeMapping } from '@local/types';

import { useAllManualTransactionTemplates } from '../../hooks/transactionTemplate/useAllTransactionTemplates';
import { IconName } from '../icon/icon';
import { LinkList } from '../link-list/link-list';
import { LinkListLink } from '../link-list/link-list.link';

interface TransactionTemplatesListProps {
  className?: string;
}

export const TransactionTemplatesList = ({
  className,
}: TransactionTemplatesListProps): JSX.Element | null => {
  const transactionTemplates = useAllManualTransactionTemplates();

  if (!transactionTemplates.length) return null;

  return (
    <section className={className}>
      <LinkList label="Shortcuts">
        {transactionTemplates.map(
          ({ _id: id, templateName, templateVisibility }) => (
            <LinkListLink
              icon={IconName.lightningBolt}
              link={`/statistics/${TransactionTypeMapping[templateVisibility]}/add/${id}`}
              key={id}
            >
              {templateName}
            </LinkListLink>
          )
        )}
      </LinkList>
    </section>
  );
};
