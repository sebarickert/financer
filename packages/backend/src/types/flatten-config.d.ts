export type FlattenConfig<T extends object> = {
  [K in keyof T as T[K] extends object
    ? T[K] extends URL
      ? K
      : never
    : // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      T[K] extends Function
      ? never
      : K]: T[K];
} & ({
  [K in keyof T as T[K] extends object
    ? T[K] extends URL
      ? never
      : Extract<keyof FlattenConfig<T[K]>, string>
    : never]: K;
} extends infer L
  ? {
      [K in keyof L as `${Extract<L[K], string>}.${Extract<K, string>}`]: FlattenConfig<
        Extract<T[Extract<L[K], keyof T>], object>
      > extends infer F
        ? F[Extract<K, keyof F>]
        : never;
    }
  : never);
