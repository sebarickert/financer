export type ChartData<
  T extends Record<string, unknown> = Record<string, unknown>,
> =
  T extends Record<string, unknown>
    ? ({ dataKey: string } & T)[] // When a custom type is provided, require dataKey with the properties of T
    : { dataKey: string; [key: string]: unknown }[]; // When no type is provided, allow any keys
