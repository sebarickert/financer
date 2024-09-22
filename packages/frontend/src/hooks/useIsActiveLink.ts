import { usePathname } from 'next/navigation';

import { IsActiveLink } from '$utils/is-link-active';

type UseIsActiveLinkProps = Omit<IsActiveLink, 'pathname'>;

export const useIsActiveLink = ({
  url,
  isExact = false,
  disallowedPathEndings = [],
}: UseIsActiveLinkProps) => {
  const pathname = usePathname();
  const match = isExact ? pathname === url : pathname.startsWith(url);

  return (
    match && !disallowedPathEndings.some((part) => pathname.endsWith(part))
  );
};
