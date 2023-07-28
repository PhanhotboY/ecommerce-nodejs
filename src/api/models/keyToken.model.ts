import { Schema, model } from 'mongoose';

import { KEYTOKEN } from '../constants';
import { IKeyTokenAttrs, IKeyToken, IKeyTokenModel } from '../interfaces/keyToken.interface';

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: 'Shop',
    },
    publicKey: {
      type: String,
      trim: true,
    },
    privateKey: {
      type: String,
      trim: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: KEYTOKEN.COLLECTION_NAME,
  }
);

keyTokenSchema.statics.build = async (attrs: IKeyTokenAttrs) => {
  return KeyTokenModel.create(attrs);
};

export const KeyTokenModel = model<IKeyToken, IKeyTokenModel>(
  KEYTOKEN.DOCUMENT_NAME,
  keyTokenSchema
);
