import { NavLink } from 'react-router-dom';

import { usePageInfoContext } from '../../context/pageInfoContext';
import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

export const MobileHeader = (): JSX.Element => {
  const [{ title, backLink, headerAction }] = usePageInfoContext();

  let dynamicHeaderClasses = 'grid-cols-1';

  if ((backLink && headerAction) || (backLink && !headerAction)) {
    dynamicHeaderClasses = 'grid-cols-[44px,1fr,44px]';
  }

  if (!backLink && headerAction) {
    dynamicHeaderClasses = 'grid-cols-[1fr,44px]';
  }

  return (
    <>
      <div
        className={`bg-white-off border-b text-center fixed top-0 left-0 right-0 z-50 grid items-center h-11 ${dynamicHeaderClasses}`}
      >
        {backLink && (
          <NavLink
            to={backLink}
            className="h-11 w-11 inline-flex items-center justify-center"
            data-testid="header-back-link"
          >
            <span className="sr-only">Go back</span>
            <Icon type={IconName.chevronLeft} />
          </NavLink>
        )}
        <Heading
          variant="h1"
          className="justify-center"
          titleClassName={`!text-lg !tracking-tight !font-semibold !block truncate ${
            !backLink && headerAction ? 'pl-[44px]' : ''
          }`}
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
    </>
  );
};
