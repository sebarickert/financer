export type ForceMutable<T> = {
  -readonly [P in keyof T]: T[P];
};
