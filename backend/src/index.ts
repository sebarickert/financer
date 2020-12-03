import mongoose from "mongoose";

import "./config/load-env";
import "./config/passport-setup";
import { MONGODB_URI } from "./config/keys";
import app from "./server";

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
