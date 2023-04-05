import { useRouter } from 'next/router';

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
  const { pathname } = useRouter();
  const match = isExact ? pathname === link : pathname.startsWith(link);

  return (
    match && !disallowedPathEndings.some((part) => pathname.endsWith(part))
  );
};
