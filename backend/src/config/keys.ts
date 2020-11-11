export const GITHUB_TOKENS = {
  IS_ACTIVATED:
    typeof process.env.GITHUB_CLIENT_ID !== "undefined" &&
    typeof process.env.GITHUB_CLIENT_SECRET !== "undefined" &&
    process.env.GITHUB_CLIENT_ID.length > 0 &&
    process.env.GITHUB_CLIENT_SECRET.length > 0,
  GITHUB_CLIENT_ID:
    typeof process.env.GITHUB_CLIENT_ID !== "undefined"
      ? process.env.GITHUB_CLIENT_ID
      : "",
  GITHUB_CLIENT_SECRET:
    typeof process.env.GITHUB_CLIENT_SECRET !== "undefined"
      ? process.env.GITHUB_CLIENT_SECRET
      : "",
};

export const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/passport-express-react_dev`;

export const COOKIE_KEY = process.env.COOKIE_KEY
  ? process.env.COOKIE_KEY
  : "thisappisawesome";
