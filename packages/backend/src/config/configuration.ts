import { getMemoryDbUri } from './memoryDatabaseServer';

const isNotEmptyString = (value: string) => value && value.length > 0;

export const isNodeEnvInTest = () => process.env.NODE_ENV === 'test';
export const isNodeEnvInDev = () => process.env.NODE_ENV === 'development';
export const shouldOnlyExportApiSpec = () =>
  `${process.env.NEST_ONLY_EXPORT_API_SPEC}`.toUpperCase() === 'TRUE';

export const isGithubAuthEnabled = () =>
  !isNodeEnvInTest() &&
  isNotEmptyString(process.env.GITHUB_CLIENT_ID) &&
  isNotEmptyString(process.env.GITHUB_CLIENT_SECRET);

export const isAuth0AuthEnabled = () =>
  !isNodeEnvInTest() &&
  isNotEmptyString(process.env.AUTH0_DOMAIN) &&
  isNotEmptyString(process.env.AUTH0_CLIENT_ID) &&
  isNotEmptyString(process.env.AUTH0_CLIENT_SECRET);

const parseMongoDbUri = async (): Promise<string> => {
  if (!isNodeEnvInTest() && !shouldOnlyExportApiSpec()) {
    return Promise.resolve(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    );
  }

  return getMemoryDbUri();
};

export const configuration = async () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  publicUrl: process.env.PUBLIC_URL,
  cookieKey: process.env.COOKIE_KEY
    ? process.env.COOKIE_KEY
    : 'thisappisawesome',
  mongodbConnectionString: await parseMongoDbUri(),
  githubKeys: isGithubAuthEnabled()
    ? {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    : undefined,
  auth0Keys: isAuth0AuthEnabled()
    ? {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
      }
    : undefined,
});
