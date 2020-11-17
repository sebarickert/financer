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

export const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

export const COOKIE_KEY = process.env.COOKIE_KEY
  ? process.env.COOKIE_KEY
  : "thisappisawesome";
