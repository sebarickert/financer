import { ContextualNavigationItem } from '$blocks/ContextualNavigation';

export const settingsContextualNavigationItems: ContextualNavigationItem[] = [
  { label: 'General', url: '/settings/', isExact: true },
  { label: 'Preferences', url: '/settings/preferences/' },
  { label: 'Privacy', url: '/settings/privacy/' },
];
