import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import "./config/load-env";
import "./config/passport-setup";
import { COOKIE_KEY, MONGODB_URI } from "./config/keys";
import authRoutes from "./routes/authentication-route";
import profileRoutes from "./routes/profile-route";
import accountRoutes from "./routes/account-route";
import fileExists from "./utils/fileExists";

const REACT_APP_PATH = "/static/react-app/";
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

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// set up routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/account", accountRoutes);

const reactFrontendExists = fileExists(
  `${__dirname}/../${REACT_APP_PATH}index.html`
);

if (reactFrontendExists) {
  app.use(express.static(path.join(`${__dirname}/../${REACT_APP_PATH}`)));
  app.get("*", (req, res) =>
    res.sendFile(path.join(`${__dirname}/../${REACT_APP_PATH}index.html`))
  );
} else {
  // eslint-disable-next-line no-console
  console.log("React frontend not found, running developend frontpage.");
  app.get("*", (req, res) => res.send("<h1>Financer developend backend</h1>"));
}

app.use((request, response) => {
  response.status(404);
  response.send({ error: "Page not found" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
