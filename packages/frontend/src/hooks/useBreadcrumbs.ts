import { usePathname } from 'next/navigation';

const breadcrumbTitles: Record<string, string> = {
  transactions: 'Transactions',
  settings: 'Settings',
  accounts: 'Accounts',
  categories: 'Categories',
  templates: 'Templates',
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length < 2) return []; // Hide breadcrumbs for first-level pages

  return segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join('/')}`,
    title: breadcrumbTitles[segment] || decodeURIComponent(segment),
  }));
}
