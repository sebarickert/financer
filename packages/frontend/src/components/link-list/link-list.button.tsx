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
      className="relative flex gap-4 items-center focus-within:bg-gray-50 hover:bg-gray-50 overflow-hidden pl-4 w-full lg:rounded-md"
      onClick={handleClick}
      data-testid={testId}
    >
      {icon && (
        <span className="bg-gray-50 h-11 w-11 rounded-full inline-flex items-center justify-center">
          <Icon
            type={icon}
            className="stroke-black flex-shrink-0 pointer-events-none"
          />
        </span>
      )}
      <span className="text-base flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-100 after:bottom-0 flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={IconName.chevronRight}
          className=" stroke-gray-300 flex-shrink-0 pointer-events-none"
        />
      </span>
    </button>
  );
};
