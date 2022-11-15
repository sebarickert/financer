import { NavLink } from 'react-router-dom';

import { usePageInfoContext } from '../../../context/pageInfoContext';
import { Heading } from '../../elements/heading/heading';
import { Icon, IconName } from '../../elements/icon/icon';

export const DesktopHeader = (): JSX.Element => {
  const [{ title, backLink, headerAction }] = usePageInfoContext();

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        {backLink && (
          <NavLink
            to={backLink}
            className="inline-flex items-center justify-center border rounded-full h-11 w-11 bg-gray hover:bg-gray-dark border-gray-dark text-gray-darkest"
            data-testid="header-back-link"
          >
            <span className="sr-only">Go back</span>
            <Icon type={IconName.chevronLeft} />
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
