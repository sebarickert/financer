import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import path from "path";

import { COOKIE_KEY } from "./config/keys";
import authRoutes from "./routes/authentication-route";
import profileRoutes from "./routes/profile-route";
import accountRoutes from "./routes/account-route";
import incomeRoutes from "./routes/income-route";
import expenseRoutes from "./routes/expense-route";
import transactionRoutes from "./routes/transaction-route";
import fileExists from "./utils/fileExists";
import errorHandler from "./routes/middlewares/errorHandler";
import authenticationCheck from "./routes/middlewares/authenticationCheck";

const REACT_APP_PATH = "/static/react-app/";
const app = express();

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
app.use(errorHandler);
app.use("/api/*", authenticationCheck);

// set up routes
app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/transaction", transactionRoutes);

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

export default app;
