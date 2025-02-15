type TypeGuard<T> = (item: unknown) => item is T;

export type Formatter<T> = Partial<
  Record<keyof T, (value: unknown) => T[keyof T]>
>;

export const parseArrayFromFormData = <T>(
  formData: FormData,
  arrayRootName: string,
  typeGuard: TypeGuard<T>,
  formatter?: Formatter<T>,
): T[] => {
  const result: unknown[] = [];
  const regex = new RegExp(`^${arrayRootName}\\.(\\d+)\\.(\\w+)$`);

  for (const [key, value] of formData.entries()) {
    const match = regex.exec(key);

    if (match) {
      const index = parseInt(match[1], 10);
      const property = match[2] as keyof T;

      if (!result[index]) {
        result[index] = {};
      }

      const formattedValue =
        formatter && formatter[property] ? formatter[property](value) : value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result[index] as any)[property] = formattedValue;
    }
  }

  // Validate each item using the type guard and filter out invalid items
  return result.filter(typeGuard);
};
