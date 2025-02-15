export const isExternalLink = (link: string): boolean =>
  link.startsWith('https://') ||
  link.startsWith('http://') ||
  link.startsWith('//') ||
  link.startsWith('blob:') ||
  link.startsWith('/api/') ||
  link.startsWith('/auth/');
