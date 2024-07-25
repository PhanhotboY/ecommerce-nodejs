import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import 'express-async-errors';
import { v4 as uuid } from 'uuid';

import '@utils/interface';
import { logger } from '@loggers/logger.log';
import { errorHandler, notFoundHandler } from '@middlewares/error.middleware';

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to database
require('./db/init.mongodb');
require('./db/init.redis');

app.use((req, res, next) => {
  const requestId = (req.headers['x-request-id'] as string) || uuid();
  req.requestId = requestId;

  res.setHeader('x-request-id', requestId);

  logger.info('Incoming request', {
    context: req.path,
    requestId,
    metadata: req.method === 'GET' ? req.query : req.body,
  });

  next();
});

// init routers
app.use(express.Router().use('/api/v1', require('./api/routers')));

// Format not found requests response
app.use('*', notFoundHandler);
app.use(errorHandler);

export { app };
