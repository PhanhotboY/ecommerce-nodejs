import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import 'express-async-errors';

import { errorHandler, notFoundHandler } from './api/middlewares/error.middleware';

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to database
require('./db/init.mongodb');

app.use(express.Router().use('/api/v1', require('./api/routers')));

// Format not found requests response
app.use('*', notFoundHandler);
app.use(errorHandler);

export { app };
