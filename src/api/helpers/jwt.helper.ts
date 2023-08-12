import JWT from 'jsonwebtoken';

import { IShopJWTPayload } from '../interfaces/shop.interface';
import { BadRequestError } from '../core/errors';

const parseJwt = (token: string): IShopJWTPayload => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
  } catch (error) {
    console.error(error);
    throw new BadRequestError('Invalid Request!');
  }
};

const verifyJwt = (token: string, keySecret: string): IShopJWTPayload => {
  try {
    return JWT.verify(token, keySecret) as IShopJWTPayload;
  } catch (error) {
    console.error(error);
    throw new BadRequestError('Invalid Request!');
  }
};

export { parseJwt, verifyJwt };
