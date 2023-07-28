import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { ROLE } from '../constants';
import { ShopModel } from '../models/shop.model';
import { createTokenPair } from '../auth/authUtils';
import { KeyTokenService } from './keyToken.service';
import { BadRequestError, InternalServerError } from '../core/errors';
import { IShopAttrs } from '../interfaces/shop.interface';

export class AuthService {
  static async signIn({ email, password }: { email: string; password: string }) {
    return { email, password };
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
      roles: [ROLE.SHOP],
    });

    if (!newShop) {
      throw new InternalServerError('Fail to create new shop!');
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    const keyToken = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      privateKey,
      publicKey,
    });

    const tokens = createTokenPair({
      payload: { email: newShop.email },
      privateKey: keyToken.privateKey,
      publicKey: keyToken.publicKey,
    });

    return {
      shop: newShop,
      tokens,
    };
  }
}
