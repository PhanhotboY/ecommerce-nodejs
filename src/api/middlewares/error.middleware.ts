import { NextFunction, Request, Response } from 'express';

import { ErrorBase } from '../core/errors/error.abstract';
import { InternalServerError } from '../core/errors/InternalServerError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorBase) {
    return res.status(err.status).json({
      errors: err.serializeError(),
    });
  }

  const internalServerError = new InternalServerError(err.message);

  res.status(internalServerError.status).json({
    errors: internalServerError.serializeError(),
  });
};
