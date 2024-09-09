export const isExternalLink = (link: string): boolean =>
  link.substring(0, 8) === 'https://' ||
  link.substring(0, 7) === 'http://' ||
  link.substring(0, 2) === '//' ||
  link.substring(0, 5) === 'blob:' ||
  link.substring(0, 5) === '/api/' ||
  link.substring(0, 6) === '/auth/';
