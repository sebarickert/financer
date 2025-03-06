export type ClassPropertyKeys<Class extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof Class]: Class[K] extends (...args: any[]) => any
    ? never
    : K extends string
      ? K
      : never;
}[keyof Class];

export type ClassDatePropertyKeys<Class extends object> = {
  [K in keyof Class]: Class[K] extends Date ? K : never;
}[keyof Class];
