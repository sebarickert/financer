export type IsActiveLink = {
  pathname: string;
  url: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
};

export const isActiveLink = ({
  pathname,
  url,
  isExact = false,
  disallowedPathEndings = [],
}: IsActiveLink) => {
  const match = isExact ? pathname === url : pathname.startsWith(url);

  return (
    match && !disallowedPathEndings.some((part) => pathname.endsWith(part))
  );
};
