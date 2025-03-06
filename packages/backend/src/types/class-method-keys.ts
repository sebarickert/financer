export type ClassMethodKeys<Class extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof Class]: Class[K] extends (...args: any[]) => any
    ? K extends string
      ? K
      : never
    : never;
}[keyof Class];
