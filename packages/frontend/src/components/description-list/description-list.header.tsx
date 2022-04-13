import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

interface IDescriptionListHeaderProps {
  label: string;
  testId?: string;
  icon?: IconName;
}

export const DescriptionListHeader = ({
  label,
  testId,
  icon,
}: IDescriptionListHeaderProps): JSX.Element => {
  return (
    <section
      className="mb-4 inline-flex items-center gap-2"
      data-testid={testId}
    >
      {icon && <Icon type="upload" />}
      <Heading>{label}</Heading>
    </section>
  );
};
