import { NextFunction, Request, Response } from 'express';

import { ErrorBase, NotFoundError, InternalServerError } from '../core/errors';
import { logger } from '../loggers/logger.log';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Not found:::: ${req.method.toUpperCase()} ${req.baseUrl}`);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err as ErrorBase;
  if (!(error instanceof ErrorBase)) {
    error = new InternalServerError(err.message);
  }

  logger.error(err.message, { context: req.path, metadata: error.serializeError(), requestId: req.requestId });

  return res.status(error.status).json({
    errors: error.serializeError(),
  });
};
