export const GITHUB_TOKENS = {
  IS_ACTIVATED:
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    process.env.GITHUB_CLIENT_ID.length > 0 &&
    process.env.GITHUB_CLIENT_SECRET.length > 0,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID
    ? process.env.GITHUB_CLIENT_ID
    : "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
    ? process.env.GITHUB_CLIENT_SECRET
    : "",
};

export const AUTH0_TOKENS = {
  IS_ACTIVATED:
    process.env.AUTH0_DOMAIN &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    process.env.AUTH0_DOMAIN.length > 0 &&
    process.env.AUTH0_CLIENT_ID.length > 0 &&
    process.env.AUTH0_CLIENT_SECRET.length > 0,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || "",
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || "",
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || "",
};

export const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

export const COOKIE_KEY = process.env.COOKIE_KEY
  ? process.env.COOKIE_KEY
  : "thisappisawesome";
