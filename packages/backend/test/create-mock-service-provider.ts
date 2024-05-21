import { Abstract, ValueProvider } from '@nestjs/common';

export const createMockServiceProvider = <T extends Abstract<unknown>>(
  object: T,
): ValueProvider<jest.Mocked<T>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mocked: any = {};

  Object.getOwnPropertyNames(object.prototype).forEach((method) => {
    // @ts-expect-error - We are mocking the object
    if (typeof object.prototype[method] === 'function') {
      mocked[method] = jest.fn();
    }
  });

  return { provide: object, useValue: mocked as jest.Mocked<T> };
};
