import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import { usePageInfoContext } from '../../context/pageInfoContext';
import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

export const MobileHeader = (): JSX.Element => {
  const [{ title, backLink, headerAction, toolbarColor }] =
    usePageInfoContext();

  const hasBackLinkAndOrAction =
    (backLink && headerAction) || (backLink && !headerAction);
  const hasActionOnly = !backLink && headerAction;

  return (
    <div
      className={clsx(
        'text-center fixed top-0 left-0 right-0 z-50 px-4 grid items-center h-16',
        {
          ['grid-cols-1']: !hasBackLinkAndOrAction || !hasActionOnly,
          ['grid-cols-[44px,1fr,44px]']: hasBackLinkAndOrAction,
          ['grid-cols-[1fr,44px]']: hasActionOnly,
          ['bg-white']: !toolbarColor || toolbarColor === 'white',
          ['bg-neutral-900']: toolbarColor === 'black',
        }
      )}
    >
      {backLink && (
        <NavLink
          to={backLink}
          className="h-11 w-11 inline-flex items-center justify-center bg-gray-50 rounded-full"
          data-testid="header-back-link"
        >
          <span className="sr-only">Go back</span>
          <Icon type={IconName.chevronLeft} />
        </NavLink>
      )}
      <Heading
        variant="h1"
        className="justify-center"
        titleClassName={clsx(
          '!text-lg !tracking-tight !font-medium !block truncate',
          {
            ['pl-[44px]']: hasActionOnly,
            ['text-white']: toolbarColor === 'black',
          }
        )}
        testId="page-main-heading"
      >
        {title ?? '-'}
      </Heading>
      {headerAction && (
        <div className="h-11 w-11 inline-flex items-center justify-center">
          {headerAction}
        </div>
      )}
    </div>
  );
};
