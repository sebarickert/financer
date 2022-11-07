import { NavLink } from 'react-router-dom';

import { usePageInfoContext } from '../../context/pageInfoContext';
import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

export const DesktopHeader = (): JSX.Element => {
  const [{ title, backLink, headerAction }] = usePageInfoContext();

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        {backLink && (
          <NavLink
            to={backLink}
            className="inline-flex items-center justify-center rounded-full h-11 w-11 bg-gray-50"
            data-testid="header-back-link"
          >
            <span className="sr-only">Go back</span>
            <Icon type={IconName.chevronLeft} className="stroke-gray-300" />
          </NavLink>
        )}
        <Heading variant="h1" testId="page-main-heading">
          {title ?? '-'}
        </Heading>
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </div>
    </>
  );
};
