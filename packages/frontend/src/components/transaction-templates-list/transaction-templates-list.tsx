import { TransactionTypeMapping } from '@local/types';

import { useAllTransactionTemplates } from '../../hooks/transactionTemplate/useAllTransactionTemplates';
import { Heading } from '../heading/heading';
import { Shortcut } from '../shortcut/shortcut';
import { ShortcutList } from '../shortcut/shortcut.list';

interface TransactionTemplatesListProps {
  className?: string;
}

export const TransactionTemplatesList = ({
  className,
}: TransactionTemplatesListProps): JSX.Element => {
  const transactionTemplates = useAllTransactionTemplates();

  return (
    <section className={className}>
      <Heading className="mb-6">Shortcuts</Heading>
      <ShortcutList>
        {transactionTemplates.map(
          ({ _id: id, templateName, templateVisibility }) => (
            <Shortcut
              key={id}
              link={`/statistics/${TransactionTypeMapping[templateVisibility]}/add/${id}`}
            >
              {templateName}
            </Shortcut>
          )
        )}
      </ShortcutList>
    </section>
  );
};
