export const configServiceMock = () => {
  jest.fn((key: string) => {
    switch (key) {
      case 'dbConnectionString':
        return 'foo';
      default:
        // eslint-disable-next-line no-console
        console.warn(`Missing configuration mock for key [${key}]`);
        return null;
    }
  });
};
