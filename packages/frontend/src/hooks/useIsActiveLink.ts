import { usePathname } from 'next/navigation';

type UseIsActiveLinkProps = {
  url: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
};

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
