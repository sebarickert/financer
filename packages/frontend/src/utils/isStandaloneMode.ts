// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navigator = window.navigator as any;

export const isStandaloneMode = (): boolean =>
  navigator.standalone && navigator.standalone; // Safari
