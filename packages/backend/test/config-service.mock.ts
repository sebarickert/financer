export const configServiceMock = () => {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'dbConnectionString':
        return 'foo';
      default:
        console.warn(`Missing configuration mock for key [${key}]`);
        return null;
    }
  });
};
