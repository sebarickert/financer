const isNotEmptyString = (value: string) => value && value.length > 0;

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  publicUrl: process.env.PUBLIC_URL,
  cookieKey: process.env.COOKIE_KEY
    ? process.env.COOKIE_KEY
    : 'thisappisawesome',
  mongodbConnectionString: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  githubKeys:
    isNotEmptyString(process.env.GITHUB_CLIENT_ID) &&
    isNotEmptyString(process.env.GITHUB_CLIENT_SECRET)
      ? {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }
      : undefined,
  auth0Auth:
    isNotEmptyString(process.env.AUTH0_DOMAIN) &&
    isNotEmptyString(process.env.AUTH0_CLIENT_ID) &&
    isNotEmptyString(process.env.AUTH0_CLIENT_SECRET)
      ? {
          domain: process.env.AUTH0_DOMAIN,
          clientID: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
        }
      : undefined,
});
