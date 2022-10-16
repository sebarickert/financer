import { CtaBlock } from '../cta-block/cta-block';
import { CtaBlockItem } from '../cta-block/cta-block.item';
import { IconName } from '../icon/icon';

interface DashboardActionButtonsProps {
  className?: string;
}

export const DashboardActionButtons = ({
  className = '',
}: DashboardActionButtonsProps): JSX.Element => {
  return (
    <CtaBlock label="Quick transaction links" className={className}>
      <CtaBlockItem
        label="Income"
        iconName={IconName.download}
        link="/statistics/incomes/add"
        ariaLabel="Add new income transaction"
      />
      <CtaBlockItem
        label="Expense"
        iconName={IconName.upload}
        link="/statistics/expenses/add"
        ariaLabel="Add new expense transaction"
      />
      <CtaBlockItem
        label="Transfer"
        iconName={IconName.switchHorizontal}
        link="/statistics/transfers/add"
        ariaLabel="Add new transfer transaction"
      />
      <CtaBlockItem
        label="More"
        iconName={IconName.dotsHorizontal}
        link="/profile"
        ariaLabel="See more actions"
      />
    </CtaBlock>
  );
};
