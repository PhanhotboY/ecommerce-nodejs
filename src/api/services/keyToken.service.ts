import mongoose from 'mongoose';
import { IKeyToken, IKeyTokenAttrs } from '../interfaces/keyToken.interface';
import { KeyTokenModel } from '../models/keyToken.model';

async function createKeyToken({
  user,
  privateKey,
  publicKey,
  refreshToken,
  refreshTokensUsed = [],
}: IKeyTokenAttrs) {
  // const keyToken = await KeyTokenModel.build({
  //   user: userId,
  //   privateKey: privateKey.toString(),
  //   publicKey: publicKey.toString(),
  //   refreshToken: 'hello',
  // });

  const filter = { user };
  const update = {
    user,
    privateKey: privateKey.toString(),
    publicKey: publicKey.toString(),
    refreshToken,
    $push: { refreshTokensUsed: { $each: refreshTokensUsed } },
  };
  const options = { upsert: true, new: true };

  const keyToken = await KeyTokenModel.findOneAndUpdate<IKeyToken>(filter, update, options);

  return { publicKey: keyToken?.publicKey, privateKey: keyToken?.privateKey };
}

const findByUserId = async (userId: string) => {
  return KeyTokenModel.findOne<IKeyToken>({ user: new mongoose.Types.ObjectId(userId) });
};

const removeKeyById = async (id: string) => {
  return KeyTokenModel.deleteOne({ _id: id }).lean();
};

const findUsedRefreshToken = async (refreshToken: string) => {
  return KeyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
};

const findByRefreshToken = async (refreshToken: string) => {
  return KeyTokenModel.findOne({ refreshToken }).lean();
};

const updateRefreshToken = async (
  foundToken: IKeyToken,
  refreshToken: string,
  newRefreshToken: string
) => {
  return foundToken.updateOne({
    refreshToken: newRefreshToken,
    $push: { refreshTokensUsed: refreshToken },
  });
};

export {
  createKeyToken,
  findByUserId,
  removeKeyById,
  findUsedRefreshToken,
  findByRefreshToken,
  updateRefreshToken,
};
