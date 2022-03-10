import path from 'path';

import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express from 'express';
import { Express as ExpressServerType } from 'express-serve-static-core';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import { COOKIE_KEY } from './config/keys';
import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';
import { accountRouter } from './routes/account-route';
import { authenticationRouter } from './routes/authentication-route';
import { expenseRouter } from './routes/expense-route';
import { incomeRouter } from './routes/income-route';
import { authenticationCheck } from './routes/middlewares/authenticationCheck';
import { errorHandler } from './routes/middlewares/errorHandler';
import { profileRouter } from './routes/profile-route';
import { transactionCategoryMappingRouter } from './routes/transaction-category-mapping-route';
import { transactionCategoryRouter } from './routes/transaction-category-route';
import { transactionRouter } from './routes/transaction-route';
import { fileExists } from './utils/fileExists';

const REACT_APP_PATH = '/static/react-app/';

export const createExpressServer = (): ExpressServerType => {
  const app = express();
  app.use(
    session({
      secret: COOKIE_KEY,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
      saveUninitialized: false,
      resave: false,
      store: MongoStore.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client: mongoose.connection.getClient() as any,
        touchAfter: 60 * 60 * 24,
      }),
    })
  );
  if (process.env.NODE_ENV !== 'test') {
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
  } else {
    app.use(mockAuthenticationMiddleware);
  }
  app.use(express.json({ limit: '10mb' }));
  app.use(errorHandler);
  app.use('/api/*', authenticationCheck);

  // set up routes
  app.use('/auth', authenticationRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/income', incomeRouter);
  app.use('/api/expense', expenseRouter);
  app.use('/api/transaction', transactionRouter);
  app.use('/api/transaction-categories', transactionCategoryRouter);
  app.use(
    '/api/transaction-categories-mapping',
    transactionCategoryMappingRouter
  );

  const reactFrontendExists = fileExists(
    `${__dirname}/../${REACT_APP_PATH}index.html`
  );

  if (reactFrontendExists) {
    app.use(express.static(path.join(`${__dirname}/../${REACT_APP_PATH}`)));
    app.get('*', (req, res) =>
      res.sendFile(path.join(`${__dirname}/../${REACT_APP_PATH}index.html`))
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('React frontend not found, running developend frontpage.');
    app.get('*', (req, res) =>
      res.send('<h1>Financer developend backend</h1>')
    );
  }

  app.use((request, response) => {
    response.status(404);
    response.send({ error: 'Page not found' });
  });
  return app;
};
