import clsx from 'clsx';

import { IconName, Icon } from '../icon/icon';
import { Link } from '../link/link';

interface IQuickLinksItemProps {
  title: string;
  link: string;
  iconName?: IconName;
  testId?: string;
}

export const QuickLinksItem = ({
  title,
  link,
  iconName,
  testId,
}: IQuickLinksItemProps): JSX.Element => {
  const arrowSvgElement = (
    <span
      className="absolute pointer-events-none text-gray-darkest top-6 right-6"
      aria-hidden="true"
    >
      <svg
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
      </svg>
    </span>
  );

  return (
    <section
      className={clsx(
        'rounded-md p-6 bg-gray relative group focus-within:ring-2 focus-within:ring-inset focus-within:ring-black hover:bg-gray-dark focus-within:bg-gray-dark inline-flex items-center gap-4'
      )}
      data-testid={testId}
    >
      {iconName && (
        <span className="inline-flex items-center justify-center rounded-full bg-gray-dark h-11 w-11 group-hover:bg-gray group-focus-within:bg-gray">
          <Icon
            type={iconName}
            className={`stroke-charcoal flex-shrink-0 pointer-events-none`}
          />
        </span>
      )}
      <Link
        url={link}
        className="text-lg font-medium tracking-tighter truncate text-charcoal focus:outline-none"
        isAbsolute
      >
        {title}
      </Link>
      {arrowSvgElement}
    </section>
  );
};
