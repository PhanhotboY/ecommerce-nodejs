import { NextFunction, Request, Response } from 'express';

import { ErrorBase, NotFoundError, InternalServerError } from '../core/errors';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Not found:::: ${req.method.toUpperCase()} ${req.baseUrl}`);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorBase) {
    return res.status(err.status).json({
      errors: err.serializeError(),
    });
  }

  const internalServerError = new InternalServerError(err.stack);

  return res.status(internalServerError.status).json({
    errors: internalServerError.serializeError(),
  });
};
