import { ContextualNavigationItem } from '$blocks/ContextualNavigation';

export const settingsContextualNavigationItems: ContextualNavigationItem[] = [
  { label: 'General', url: '/settings/', isExact: true },
  { label: 'Templates', url: '/settings/templates/' },
  { label: 'Categories', url: '/settings/categories/' },
  { label: 'Preferences', url: '/settings/preferences/' },
  { label: 'Privacy', url: '/settings/privacy/' },
];
