import { KeyTokenModel } from '../models/keyToken.model';

export class KeyTokenService {
  static async createKeyToken({
    userId,
    privateKey,
    publicKey,
  }: {
    userId: string;
    privateKey: string;
    publicKey: string;
  }) {
    const keyToken = await KeyTokenModel.build({
      user: userId,
      privateKey: privateKey.toString(),
      publicKey: publicKey.toString(),
      refreshToken: 'hello',
    });

    return keyToken;
  }
}
