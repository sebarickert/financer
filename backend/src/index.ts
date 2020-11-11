import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import "./config/load-env";
import "./config/passport-setup";
import { COOKIE_KEY, MONGODB_URI } from "./config/keys";
import authRoutes from "./routes/auth/authentication-route";
import profileRoutes from "./routes/profile";
import authCheck from "./routes/authenticationCheck";

const app = express();
const port = 4000; // default port to listen

// connect to mongodb
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error("failed to connect to mongo db");
      // eslint-disable-next-line no-console
      console.error(`${err.name}: ${err.message}`);
    } else {
      // eslint-disable-next-line no-console
      console.log("connected to mongo db");
    }
  }
);

app.use(
  cookieSession({
    name: "session",
    keys: [COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
