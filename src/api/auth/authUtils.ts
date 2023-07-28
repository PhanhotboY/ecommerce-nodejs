import JWT from 'jsonwebtoken';
import { IShopJWTPayload } from '../interfaces/shop.interface';

export function createTokenPair({
  payload,
  privateKey,
  publicKey,
}: {
  payload: IShopJWTPayload;
  privateKey: string;
  publicKey: string;
}) {
  const accessToken = JWT.sign({ ...payload, hell: 'I am PhanhotboY' }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days',
  });

  return { accessToken, refreshToken };
}
