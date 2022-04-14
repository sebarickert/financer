import { Dropdown, DropdownItemType } from '../dropdown/dropdown';
import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

interface DescriptionListHeaderProps {
  label: string;
  testId?: string;
  icon?: IconName;
  filterOptions?: DropdownItemType[];
}

export const DescriptionListHeader = ({
  label,
  testId,
  icon,
  filterOptions,
}: DescriptionListHeaderProps): JSX.Element => {
  return (
    <section className="mb-4 flex justify-between" data-testid={testId}>
      <span className="flex items-center gap-2">
        {icon && <Icon type={icon} />}
        <Heading>{label}</Heading>
      </span>
      {filterOptions && (
        <Dropdown
          items={filterOptions}
          label="Filter"
          className="mb-[-3px] sm:mb-[-1px]"
        />
      )}
    </section>
  );
};
