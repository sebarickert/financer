import { DatabaseServer } from './database-server';

const isNotEmptyString = (value: string) => value && value.length > 0;

export const isNodeEnvInDev = () => process.env.NODE_ENV === 'development';
export const isNodeEnvInTest = () => process.env.NODE_ENV === 'test';

export const shouldUseInternalTestDockerDb = () =>
  process.env.USE_INTERNAL_TEST_DOCKER_DB === 'true';

export const shouldUseInternalDevelopmentDockerDb = () =>
  process.env.USE_INTERNAL_DEVELOPMENT_DOCKER_DB === 'true';

export const isApplicationInTestMode = () =>
  isNodeEnvInTest() || shouldUseInternalTestDockerDb();

export const shouldOnlyExportApiSpec = () =>
  `${process.env.NEST_ONLY_EXPORT_API_SPEC}`.toUpperCase() === 'TRUE';

export const isGithubAuthEnabled = () =>
  !isApplicationInTestMode() &&
  isNotEmptyString(process.env.GITHUB_CLIENT_ID) &&
  isNotEmptyString(process.env.GITHUB_CLIENT_SECRET);

export const isAuth0AuthEnabled = () =>
  !isApplicationInTestMode() &&
  isNotEmptyString(process.env.AUTH0_DOMAIN) &&
  isNotEmptyString(process.env.AUTH0_CLIENT_ID) &&
  isNotEmptyString(process.env.AUTH0_CLIENT_SECRET);

export const shouldUseInternalDockerDb = () =>
  shouldUseInternalDevelopmentDockerDb() ||
  shouldUseInternalTestDockerDb() ||
  shouldOnlyExportApiSpec();

/** Test database is hosted and started externally e.g. Github Action service which we have to provision with schema and test user  */
const shouldInitializeSchemaAndTestUser = () =>
  process.env.INITIALIZE_SCHEMA_AND_TEST_USER === 'true';

const parseDbUri = async (): Promise<string> => {
  const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

  const hasExternalDb = !shouldUseInternalDockerDb();

  if (hasExternalDb) {
    if (shouldInitializeSchemaAndTestUser()) {
      return DatabaseServer.setupTestDatabase(connectionString);
    } else {
      return Promise.resolve(connectionString);
    }
  }

  return DatabaseServer.setupDevelopmentDatabase();
};

export const configuration = async () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  publicUrl: process.env.PUBLIC_URL,
  cookieKey: process.env.COOKIE_KEY
    ? process.env.COOKIE_KEY
    : 'thisappisawesome',
  dbConnectionString: await parseDbUri(),
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
