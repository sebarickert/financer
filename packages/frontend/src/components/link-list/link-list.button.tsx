import { Icon, IconName } from '../icon/icon';

interface LinkListButtonProps {
  icon?: IconName;
  children: string;
  handleClick(): void;
  testId?: string;
}

export const LinkListButton = ({
  icon,
  children,
  handleClick,
  testId,
}: LinkListButtonProps): JSX.Element => {
  return (
    <button
      className="relative flex items-center w-full gap-4 pl-4 overflow-hidden group focus-within:bg-gray-50 hover:bg-gray-50 lg:rounded-md"
      onClick={handleClick}
      data-testid={testId}
    >
      {icon && (
        <span className="inline-flex items-center justify-center rounded-full bg-gray-50 h-11 w-11">
          <Icon
            type={icon}
            className="flex-shrink-0 pointer-events-none stroke-black"
          />
        </span>
      )}
      <span className="text-base flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-100 after:bottom-0 flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={IconName.chevronRight}
          className="flex-shrink-0 pointer-events-none stroke-gray-300"
        />
      </span>
    </button>
  );
};
