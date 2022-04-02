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
      className="relative flex gap-4 items-center focus-within:bg-gray-200 hover:bg-gray-200 overflow-hidden pl-4 w-full"
      onClick={handleClick}
      data-testid={testId}
    >
      {icon && (
        <Icon
          type={icon}
          className="stroke-black flex-shrink-0 pointer-events-none"
        />
      )}
      <span className="text-base flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 group-last:after:hidden flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={'chevron-right'}
          className=" stroke-gray-300 flex-shrink-0 pointer-events-none"
        />
      </span>
    </button>
  );
};
