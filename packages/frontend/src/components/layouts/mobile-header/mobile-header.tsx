import { clsx } from 'clsx';

import { usePageInfoContext } from '../../../context/pageInfoContext';

import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { LinkViewTransition } from '$elements/link/link-view-transition';

export const MobileHeader = (): JSX.Element => {
  const [{ title, backLink, headerAction, toolbarColor }] =
    usePageInfoContext();

  const hasBackLinkAndOrAction =
    (backLink && headerAction) || (backLink && !headerAction);
  const hasActionOnly = !backLink && headerAction;

  return (
    <div
      className={clsx(
        'text-center fixed top-0 left-0 right-0 z-50 px-4 grid items-center h-16 vt-name-[mobile-header]',
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
        <LinkViewTransition
          href={backLink}
          className="inline-flex items-center justify-center border rounded-full h-11 w-11 bg-gray border-gray-dark"
          data-testid="header-back-link"
          transition="close-to-right"
        >
          <span className="sr-only">Go back</span>
          <Icon type={IconName.chevronLeft} />
        </LinkViewTransition>
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
        <div className="inline-flex items-center justify-center h-11 w-11">
          {headerAction}
        </div>
      )}
    </div>
  );
};
