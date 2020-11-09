import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import "./config/passport-setup";
import { MONGODB, SESSION } from "./config/keys";
import authRoutes from "./routes/auth-routes";

const app = express();
const port = 4000; // default port to listen

// connect to mongodb
mongoose.connect(
  MONGODB.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("failed to connect to mongo db");
      console.error(`${err.name}: ${err.message}`);
    } else {
      console.log("connected to mongo db");
    }
  }
);

app.use(
  cookieSession({
    name: "session",
    keys: [SESSION.COOKIE_KEY],
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

const authCheck = (req: any, res: any, next: any) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req: any, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
