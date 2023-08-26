import { Schema, Types, model } from 'mongoose';

import { DISCOUNT } from '../constants/discount.constant';
import { IDiscount, IDiscountModel, IDiscountAttrs } from '../interfaces/discount.interface';

const discountSchema = new Schema<IDiscount, IDiscountModel>(
  {
    name: { type: String, required: true },
    description: { type: String, require: true },
    type: { type: String, enum: ['fixed_amount', 'percentage'], default: 'fixed_amount' },
    code: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    used_count: { type: Number, required: true, default: 0 },
    used_users: { type: [Types.ObjectId], required: true, default: [] },
    quantity_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shopId: { type: Types.ObjectId, required: true, ref: 'Shop' },
    isActive: { type: Boolean, required: true, default: true },
    apply_type: { type: String, enum: ['all', 'specific'], required: true },
    product_ids: { type: [Types.ObjectId], required: true, default: [], ref: 'Product' },
  },
  {
    timestamps: true,
    collection: DISCOUNT.COLLECTION_NAME,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

discountSchema.statics.build = async (attrs: IDiscountAttrs) => {
  return DiscountModel.create(attrs);
};

export const DiscountModel = model<IDiscount, IDiscountModel>(
  DISCOUNT.DOCUMENT_NAME,
  discountSchema
);
