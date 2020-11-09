// ADD YOUR OWN KEYS AND RENAME THIS FILE TO keys.js
export const GITHUB_TOKENS = {
  GITHUB_CLIENT_ID: "client-id",
  GITHUB_CLIENT_SECRET: "client-secret"
};

const DB_USER = "admin";
const DB_PASSWORD = "change-me";
export const MONGODB = {
  MONGODB_URI: `mongodb://${DB_USER}:${DB_PASSWORD}@localhost:27017/passport-express-react_dev`
};

export const SESSION = {
  COOKIE_KEY: "thisappisawesome"
};

