import { Schema, model } from 'mongoose';

import { APIKEY } from '../constants';
import { IApiKey, IApiKeyAttrs, IApiKeyModel } from '../interfaces/apiKey.interface';

const apiKeySchema = new Schema<IApiKey, IApiKeyModel>(
  {
    key: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: APIKEY.COLLECTION_NAME,
  }
);

apiKeySchema.statics.build = async (attrs: IApiKeyAttrs) => {
  return ApiKeyModel.create(attrs);
};

export const ApiKeyModel = model<IApiKey, IApiKeyModel>(APIKEY.DOCUMENT_NAME, apiKeySchema);
