export type ChartConfig = Record<
  string,
  { label: string; color: string; valueFormatter?(value: unknown): string }
>;
