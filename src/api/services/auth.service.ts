import bcrypt from 'bcrypt';

import { ROLE } from '../constants';
import { getReturnData } from '../utils';
import { findShopByEmail } from './shop.service';
import { ShopModel } from '../models/shop.model';
import { createTokenPair, generateKeyPair } from '../auth/authUtils';
import { IShopAttrs, IShopJWTPayload } from '../interfaces/shop.interface';
import { IKeyToken, IKeyTokenAttrs } from '../interfaces/keyToken.interface';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
} from '../core/errors';
import {
  removeKeyById,
  createKeyToken,
  updateRefreshToken,
} from './keyToken.service';

export class AuthService {
  static async signIn({
    email,
    password,
    refreshToken = null,
  }: {
    email: string;
    password: string;
    refreshToken: string | null;
  }) {
    const foundShop = await findShopByEmail(email);

    if (!foundShop) {
      throw new BadRequestError('Shop is not registered!');
    }

    const isMatchPwd = bcrypt.compareSync(password, foundShop.password);

    if (!isMatchPwd) {
      throw new BadRequestError('Authentication failed!');
    }

    const { privateKey, publicKey } = generateKeyPair();

    const tokens = createTokenPair({
      payload: { userId: foundShop._id, email: foundShop.email },
      privateKey,
      publicKey,
    });

    const keyTokenAttrs: IKeyTokenAttrs = {
      user: foundShop._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    };

    if (refreshToken) keyTokenAttrs.refreshTokensUsed = [refreshToken];

    await createKeyToken(keyTokenAttrs);

    return {
      shop: getReturnData(foundShop, {
        fields: ['id', 'name', 'email', 'msisdn'],
      }),
      tokens,
    };
  }

  static async signUp({ name, email, password, msisdn }: IShopAttrs) {
    const existedShop = await ShopModel.findOne({ email }).lean();

    if (existedShop) {
      throw new BadRequestError('Email already registered!');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await ShopModel.build({
      name,
      email,
      password: hashPassword,
      msisdn,
      status: 'active',
    });

    if (!newShop) {
      throw new InternalServerError('Fail to create new shop!');
    }

    const { privateKey, publicKey } = generateKeyPair();

    const tokens = createTokenPair({
      payload: { userId: newShop._id, email: newShop.email },
      privateKey,
      publicKey,
    });

    await createKeyToken({
      user: newShop._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getReturnData(newShop, {
        fields: ['id', 'name', 'email', 'msisdn'],
      }),
      tokens,
    };
  }

  static async signOut(id: string) {
    return await removeKeyById(id);
  }

  static async refreshTokenHandler({
    keyToken,
    refreshToken,
    user,
  }: {
    keyToken: IKeyToken;
    refreshToken: string;
    user: IShopJWTPayload;
  }) {
    // Check if refreshToken has been used?
    if (keyToken.refreshTokensUsed.includes(refreshToken)) {
      // The token is used for the second time => malicious behavior => require user to log in again
      await removeKeyById(keyToken._id as string);
      throw new ForbiddenError(
        'Something wrong happened. Please login again!!'
      );
    }

    // The token is used for the first time => valid
    // Token not exists in DB
    if (keyToken.refreshToken !== refreshToken)
      throw new BadRequestError('Invalid request.');

    // Token exists in DB
    const tokens = createTokenPair({
      payload: user,
      privateKey: keyToken.privateKey,
      publicKey: keyToken.publicKey,
    });

    await updateRefreshToken(keyToken, refreshToken, tokens.refreshToken);

    return tokens;
  }
}
