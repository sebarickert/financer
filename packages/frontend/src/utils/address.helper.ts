const internalApiRootAddress =
  process.env.INTERNAL_API_ROOT_ADDRESS ?? 'http://localhost:4000';

export const getInternalApiRootAddress = () => {
  return internalApiRootAddress;
};
