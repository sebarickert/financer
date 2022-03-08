import { useResolvedPath, useMatch, useLocation } from 'react-router-dom';

type UseIsActiveLinkProps = {
  link: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
};

export const useIsActiveLink = ({
  link,
  isExact = false,
  disallowedPathEndings = [],
}: UseIsActiveLinkProps) => {
  const resolved = useResolvedPath(link);
  const match = useMatch({ path: resolved.pathname, end: isExact });
  const location = useLocation();

  return (
    Boolean(match) &&
    !disallowedPathEndings.some((part) => location.pathname.endsWith(part))
  );
};
