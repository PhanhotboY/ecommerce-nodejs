import { NextFunction, Request, Response } from 'express';

import { HEADER } from '../constants';
import { parseJwt, verifyJwt } from '../helpers/jwt.helper';
import { findByUserId } from '../services/keyToken.service';
import { NotFoundError } from '../core/errors/NotFoundError';
import { IKeyToken } from '../interfaces/keyToken.interface';
import { BadRequestError, UnauthorizedError } from '../core/errors';
import { IShopJWTPayload } from '../interfaces/shop.interface';

declare global {
  namespace Express {
    interface Request {
      keyToken: IKeyToken;
      user: IShopJWTPayload;
      refreshToken: string;
    }
  }
}

async function authenticationV2(req: Request, res: Response, next: NextFunction) {
  const clientId = req.headers[HEADER.CLIENT_ID] as string;
  const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string;
  if (!clientId) throw new BadRequestError('Invalid request');

  // 2
  const keyToken = await findByUserId(clientId);
  if (!keyToken) throw new NotFoundError('KeyStore Not Found');

  if (refreshToken) {
    const { userId, email } = parseJwt(refreshToken);
    if (clientId !== userId) throw new BadRequestError('Invalid Request');

    req.user = { userId, email };
    req.refreshToken = refreshToken;
  } else {
    if (!accessToken) throw new UnauthorizedError('Invalid request');

    const { userId, email } = verifyJwt(accessToken, keyToken.publicKey);
    if (clientId !== userId) throw new UnauthorizedError('Invalid token');

    req.user = { userId, email };
  }

  req.keyToken = keyToken;

  return next();
}

async function authentication(req: Request, res: Response, next: NextFunction) {
  /**
   *    1. Check if userId is missing
   *    2. Check KeyToken in DB
   *    3. Verify accessToken
   *    4. Check user in DB
   *    5. Check accessToken in DB
   *    6. All passed => return
   */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID] as string;
  if (!userId) throw new BadRequestError('Invalid request');

  // 2
  const keyToken = await findByUserId(userId);
  if (!keyToken) throw new NotFoundError('KeyStore Not Found');

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
  if (!accessToken) throw new UnauthorizedError('Invalid request');

  const payload = parseJwt(accessToken);
  if (payload.userId !== userId) throw new UnauthorizedError('Invalid token');

  // 6
  req.keyToken = keyToken;

  return next();
}

export { authenticationV2 };
