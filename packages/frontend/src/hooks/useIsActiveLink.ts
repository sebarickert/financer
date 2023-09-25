import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

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
  const { pathname } = useViewTransitionRouter();
  const match = isExact ? pathname === link : pathname.startsWith(link);

  return (
    match && !disallowedPathEndings.some((part) => pathname.endsWith(part))
  );
};
