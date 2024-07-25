import { NextFunction, Request, Response } from 'express';

import { HEADER } from '../constants';
import { ForbiddenError } from '../core/errors/ForbiddenError';
import { findActiveApiKey } from '../services/apiKey.service';

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[HEADER.API_KEY]?.toString();

  if (!apiKey) {
    throw new ForbiddenError('You should not be here!');
  }

  const objKey = await findActiveApiKey(apiKey);

  if (!objKey) {
    throw new ForbiddenError('Provided Api key does not exist!');
  }

  req.objKey = objKey;

  return next();
};

const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions?.length) throw new ForbiddenError('Permission denied');

    const isMatchPermission = req.objKey.permissions.includes(permission);

    if (!isMatchPermission) throw new ForbiddenError('Permission denied');

    return next();
  };
};

export { checkApiKey, checkPermission };
