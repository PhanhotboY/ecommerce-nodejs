import { Schema, Types, model } from 'mongoose';

import { CART } from '../constants/cart.constant';
import { ICart, ICartAttrs, ICartModel } from '../interfaces/cart.interface';
import { SHOP } from '../constants';

const cartSchema = new Schema<ICart, ICartModel>(
  {
    userId: { type: Types.ObjectId, required: true, ref: SHOP.DOCUMENT_NAME },
    state: {
      type: String,
      enum: [CART.STATE.ACTIVE, CART.STATE.COMPLETED, CART.STATE.FAILED, CART.STATE.PENDING],
      required: true,
      default: CART.STATE.ACTIVE,
    },
    /**
     * [
     *  {
     *      productId,
     *      shopId,
     *      quantity
     *  }
     * ]
     */
    products: { type: [Object], default: [] },
    total_count: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updatedOn',
    },
    collection: CART.COLLECTION_NAME,
  }
);

cartSchema.statics.build = async (attrs: ICartAttrs) => {
  return CartModel.create(attrs);
};

export const CartModel = model<ICart, ICartModel>(CART.DOCUMENT_NAME, cartSchema);
