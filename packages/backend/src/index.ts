import http, { Server } from 'http';
import { Socket } from 'net';

import mongoose from 'mongoose';

import './config/load-env';
import './config/passport-setup';
import { MONGODB_URI } from './config/keys';
import {
  connect as connectToTestDbInMemory,
  disconnect as disconnectFromTestDbInMemory,
  memoryDatabaseServer,
} from './config/MemoryDatabaseServer';
import { createExpressServer } from './server';

const port = 4000; // default port to listen

let connections: Socket[] = [];

let server: Server;

const startServer = async () => {
  let connectedToDb;
  if (process.env.NODE_ENV !== 'test') {
    // connect to mongodb
    try {
      await mongoose.connect(MONGODB_URI);
      // eslint-disable-next-line no-console
      console.log('connected to mongo db');
      connectedToDb = true;
    } catch (untypeErr) {
      const err = untypeErr as mongoose.CallbackError;
      // eslint-disable-next-line no-console
      console.error('failed to connect to mongo db');
      // eslint-disable-next-line no-console
      console.error(`${err?.name}: ${err?.message}`);
    }
  } else {
    await memoryDatabaseServer.start();
    await connectToTestDbInMemory();
    // eslint-disable-next-line no-console
    console.log('Connected to in memory test db');
    connectedToDb = true;
  }

  server = connectedToDb
    ? createExpressServer().listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started at http://localhost:${port}`);
      })
    : http
        .createServer((request, response) => {
          response.writeHead(500, { 'Content-Type': 'text/html' });
          response.write('<h1>Internal server error</h1>');
          response.end();
        })
        .listen(port);

  server.on('connection', (connection) => {
    connections.push(connection);
    connection.on('close', () => {
      connections = connections.filter((curr) => curr !== connection);
    });
  });
};

const shutDown = () => {
  // eslint-disable-next-line no-console
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  if (process.env.NODE_ENV === 'test') {
    const closeConnectionAndStopInMemoryTestDb = async () => {
      await disconnectFromTestDbInMemory();
      await memoryDatabaseServer.stop();
      // eslint-disable-next-line no-console
      console.log('In memory test db stopped');
    };
    closeConnectionAndStopInMemoryTestDb();
  }

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
};

startServer();
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
