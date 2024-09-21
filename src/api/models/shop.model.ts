import { model, Schema } from 'mongoose';

import { SHOP } from '../constants';
import { IShopAttrs, IShop, IShopModel } from '../interfaces/shop.interface';
import _ from 'lodash';

const shopSchema = new Schema<IShop, IShopModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    msisdn: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: SHOP.COLLECTION_NAME,
    toJSON: {
      transform(doc: IShop, ret: Record<string, any>) {
        ret.id = doc._id;
        ret = _.pick(doc, ['id', 'email', 'verify', 'status', 'name']);

        return ret;
      },
    },
  }
);

shopSchema.statics.build = async (attrs: IShopAttrs) => {
  return ShopModel.create(attrs);
};

export const ShopModel = model<IShop, IShopModel>(
  SHOP.DOCUMENT_NAME,
  shopSchema
);
