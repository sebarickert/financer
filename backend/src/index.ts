import mongoose from "mongoose";
import { Socket } from "net";

import "./config/load-env";
import "./config/passport-setup";
import { MONGODB_URI } from "./config/keys";
import app from "./server";
import memoryDatabaseServer, {
  connect as connectToTestDbInMemory,
  disconnect as disconnectFromTestDbInMemory,
} from "./config/MemoryDatabaseServer";

const port = 4000; // default port to listen

let connections: Socket[] = [];

if (process.env.NODE_ENV !== "test") {
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
} else {
  const openDbAndConnection = async () => {
    await memoryDatabaseServer.start();
    await connectToTestDbInMemory();
    // eslint-disable-next-line no-console
    console.log("Connected to in memory test db");
  };
  openDbAndConnection();
}

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on("close", () => {
    connections = connections.filter((curr) => curr !== connection);
  });
});

const shutDown = () => {
  // eslint-disable-next-line no-console
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  if (process.env.NODE_ENV === "test") {
    const closeConnectionAndStopInMemoryTestDb = async () => {
      await disconnectFromTestDbInMemory();
      await memoryDatabaseServer.stop();
      // eslint-disable-next-line no-console
      console.log("In memory test db stopped");
    };
    closeConnectionAndStopInMemoryTestDb();
  }

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
